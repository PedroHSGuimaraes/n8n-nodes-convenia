import { randomBytes } from 'crypto';

import type { ConveniaRequest } from './buildRequest';
import { ConveniaInputError } from './errors';
import { DEFAULT_MAX_PAGES, sameOriginNext, slicePage, unwrapData } from './pagination';
import { safeUploadName } from './payload';
import { redactText, safeApiMessage } from './redact';
import { backoffMs, shouldRetry, type RetryClass } from './retry';
import { MinuteWindowLimiter } from './rateLimit';
import { requiredString } from './values';

export const REQUEST_TIMEOUT_MS = 60_000;

export interface RawResponse {
	statusCode: number;
	headers: Record<string, string | string[] | undefined>;
	body: unknown;
}

export interface CallOptions {
	method: string;
	url: string;
	qs?: Record<string, string | number>;
	body?: unknown;
	headers?: Record<string, string>;
	encoding?: 'arraybuffer';
	json?: boolean;
	timeout: number;
}

export interface HttpCall {
	(options: CallOptions): Promise<RawResponse>;
}

export interface UploadFile {
	buffer: Buffer;
	fileName: string;
	mimeType?: string;
}

export type RunResult =
	| { kind: 'items'; items: unknown[] }
	| { kind: 'binary'; buffer: Buffer; fileName: string; mimeType: string };

const limiters = new Map<string, MinuteWindowLimiter>();

export function limiterFor(credentialId: string | undefined): MinuteWindowLimiter {
	const key = credentialId && credentialId.trim() !== '' ? credentialId : 'anonymous';
	const existing = limiters.get(key);
	if (existing) return existing;
	const created = new MinuteWindowLimiter();
	limiters.set(key, created);
	return created;
}

export function resetLimiters(): void {
	limiters.clear();
}

export function assertBaseUrl(value: unknown): string {
	const text = requiredString(value, 'URL base').replace(/\/+$/, '');
	let url: URL | undefined;
	try {
		url = new URL(text);
	} catch {
		url = undefined;
	}
	if (!url) throw new ConveniaInputError('URL base inválida.');
	if (url.protocol !== 'https:') throw new ConveniaInputError('A URL base precisa usar HTTPS.');
	if (url.username || url.password) {
		throw new ConveniaInputError('A URL base não pode conter usuário ou senha.');
	}
	if (url.search || url.hash) throw new ConveniaInputError('A URL base não pode ter query string nem fragmento.');
	return text;
}

export class ConveniaApiError extends Error {
	readonly name = 'ConveniaApiError';
	readonly statusCode?: number;

	constructor(message: string, statusCode?: number) {
		super(message);
		this.statusCode = statusCode;
	}
}

function header(headers: RawResponse['headers'], name: string): string | undefined {
	const value = headers[name] ?? headers[name.toLowerCase()];
	if (Array.isArray(value)) return value[0];
	return value;
}

function parseJsonBody(body: unknown): unknown {
	if (typeof body !== 'string') return body;
	if (body.trim() === '') return undefined;
	let parsed: unknown;
	let invalid = false;
	try {
		parsed = JSON.parse(body);
	} catch {
		invalid = true;
	}
	if (invalid) throw new ConveniaApiError('A Convenia retornou um corpo que não é JSON.');
	return parsed;
}

function asBuffer(body: unknown): Buffer {
	if (Buffer.isBuffer(body)) return body;
	if (body instanceof ArrayBuffer) return Buffer.from(body);
	if (ArrayBuffer.isView(body)) return Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	throw new ConveniaApiError('A Convenia não retornou o arquivo em formato binário.');
}

function fileNameFromHeader(value: string | undefined, fallback: string): string {
	if (!value) return fallback;
	const encoded = /filename\*=UTF-8''([^;]+)/i.exec(value)?.[1];
	const plain = /filename="?([^";]+)"?/i.exec(value)?.[1];
	const name = encoded ? decodeURIComponent(encoded) : plain;
	if (!name) return fallback;
	return name.split(/[/\\]/).pop()?.replace(/[\r\n"]/g, '') || fallback;
}

function multipart(file: UploadFile): { body: Buffer; contentType: string } {
	const fileName = safeUploadName(file.fileName);
	const mime = file.mimeType && /^[\w.+-]+\/[\w.+-]+$/.test(file.mimeType) ? file.mimeType : 'application/octet-stream';
	const boundary = `convenia${randomBytes(12).toString('hex')}`;
	const head = Buffer.from(
		`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: ${mime}\r\n\r\n`,
	);
	const tail = Buffer.from(`\r\n--${boundary}--\r\n`);
	return {
		body: Buffer.concat([head, file.buffer, tail]),
		contentType: `multipart/form-data; boundary=${boundary}`,
	};
}

async function once(
	call: HttpCall,
	limiter: MinuteWindowLimiter,
	request: ConveniaRequest,
	url: string,
	query: Record<string, string | number> | undefined,
	file: UploadFile | undefined,
	sleep: (ms: number) => Promise<void>,
): Promise<RawResponse> {
	let attempt = 1;
	let lastMessage = 'Não foi possível concluir a requisição para a Convenia.';
	if (request.multipart && !file) throw new ConveniaInputError('Anexe o arquivo no campo binário informado.');
	const form = request.multipart && file ? multipart(file) : undefined;
	for (;;) {
		await limiter.take();
		let response: RawResponse | undefined;
		let network = false;
		try {
			response = await call({
				method: request.method,
				url,
				qs: query && Object.keys(query).length > 0 ? query : undefined,
				body: form ? form.body : request.body,
				headers: form ? { 'content-type': form.contentType } : undefined,
				encoding: request.response === 'binary' ? 'arraybuffer' : undefined,
				json: request.response !== 'binary' && !form,
				timeout: REQUEST_TIMEOUT_MS,
			});
		} catch (error) {
			network = true;
			lastMessage = redactText(error instanceof Error ? error.message : 'Falha de rede ao chamar a Convenia.');
		}
		if (response && response.statusCode < 400) return response;
		const status = response?.statusCode;
		const retryAfter = response ? header(response.headers, 'retry-after') : undefined;
		const errorBody =
			response && request.response === 'binary' && Buffer.isBuffer(response.body)
				? response.body.toString('utf8')
				: response?.body;
		let parsed: unknown;
		if (response) {
			try {
				parsed = parseJsonBody(errorBody);
			} catch {
				parsed = undefined;
			}
		}
		if (response) lastMessage = safeApiMessage(status, parsed, retryAfter);
		const decision = shouldRetry({
			retry: request.retry,
			attemptsMade: attempt,
			status,
			network,
		});
		if (!decision.retry) {
			const uncertain =
				request.retry === 'write' && (network || status === 429 || status === 502 || status === 504)
					? ' A escrita não foi repetida: a documentação não garante que a tentativa deixou de alterar dados.'
					: '';
			throw new ConveniaApiError(`${lastMessage}${uncertain}`, status);
		}
		await sleep(backoffMs(attempt, retryAfter));
		attempt += 1;
	}
}

function unwrapOrThrow(body: unknown): unknown {
	let value: unknown;
	let failure: unknown;
	try {
		value = unwrapData(body);
	} catch (error) {
		failure = error;
	}
	if (failure) {
		const message = failure instanceof Error ? failure.message : 'success=false';
		throw new ConveniaApiError(redactText(message));
	}
	return value;
}

export async function performRequest(input: {
	call: HttpCall;
	limiter: MinuteWindowLimiter;
	sleep: (ms: number) => Promise<void>;
	baseUrl: string;
	request: ConveniaRequest;
	file?: UploadFile;
}): Promise<RunResult> {
	const baseUrl = assertBaseUrl(input.baseUrl);
	let url = `${baseUrl}${input.request.path}`;
	let query: Record<string, string | number> | undefined = input.request.query;
	const collected: unknown[] = [];
	let tokenShell: Record<string, unknown> | undefined;
	const maxPages = input.request.maxPages ?? DEFAULT_MAX_PAGES;
	if (!Number.isInteger(maxPages) || maxPages < 1) {
		throw new ConveniaInputError('Max Pages deve ser um inteiro a partir de 1.');
	}
	const seenUrls = new Set<string>();
	for (let page = 1; page <= maxPages; page += 1) {
		if (seenUrls.has(url)) {
			throw new ConveniaInputError(
				'A paginação repetiu uma URL já consultada. O node não devolveu uma lista parcial.',
			);
		}
		seenUrls.add(url);
		const response = await once(input.call, input.limiter, input.request, url, query, input.file, input.sleep);
		if (input.request.response === 'binary') {
			const fallback = input.request.fileName || 'convenia.bin';
			return {
				kind: 'binary',
				buffer: asBuffer(response.body),
				fileName: input.request.fileName || fileNameFromHeader(header(response.headers, 'content-disposition'), fallback),
				mimeType: header(response.headers, 'content-type') || 'application/octet-stream',
			};
		}
		const body = parseJsonBody(response.body);
		if (input.request.pagination !== 'none') unwrapOrThrow(body);
		if (input.request.pagination === 'none') {
			if (body === undefined || body === null || body === '') {
				return { kind: 'items', items: [{ success: true, statusCode: response.statusCode }] };
			}
			if (input.request.includeEnvelope) return { kind: 'items', items: [body] };
			const data = unwrapOrThrow(body);
			return { kind: 'items', items: Array.isArray(data) ? data : [data] };
		}
		const slice = slicePage(body, input.request.pagination, page);
		if (input.request.pagination === 'tokenPermissions' && !input.request.includeEnvelope) {
			const data = unwrapOrThrow(body);
			const record = data && typeof data === 'object' && !Array.isArray(data) ? (data as Record<string, unknown>) : {};
			tokenShell = tokenShell ?? { ...record, permissions: [] };
			const permissions = tokenShell.permissions as unknown[];
			permissions.push(...slice.items);
			if (slice.done) return { kind: 'items', items: [tokenShell] };
			const next = advancePage(url, slice.nextUrl, page, maxPages);
			url = next;
			query = undefined;
			continue;
		}
		if (input.request.includeEnvelope) collected.push(body);
		else collected.push(...slice.items);
		if (slice.done) return { kind: 'items', items: collected };
		url = advancePage(url, slice.nextUrl, page, maxPages);
		query = undefined;
	}
	throw new ConveniaInputError(
		`Return All atingiu o máximo de ${maxPages} páginas e a API ainda indica outra página. Nada foi devolvido. Aumente Max Pages ou refine os filtros.`,
	);
}

function advancePage(currentUrl: string, nextUrl: string | undefined, page: number, maxPages: number): string {
	const next = sameOriginNext(currentUrl, nextUrl);
	if (!next) {
		throw new ConveniaInputError(
			'A API indicou outra página, mas não enviou next_page_url na mesma origem. O node não devolveu uma lista parcial.',
		);
	}
	if (page >= maxPages) {
		throw new ConveniaInputError(
			`Return All atingiu o máximo de ${maxPages} páginas e a API ainda indica outra página. Nada foi devolvido. Aumente Max Pages ou refine os filtros.`,
		);
	}
	return next.toString();
}

export function retryClassOf(request: ConveniaRequest): RetryClass {
	return request.retry;
}
