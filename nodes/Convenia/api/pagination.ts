export const DEFAULT_MAX_PAGES = 100;

export interface PageSlice {
	items: unknown[];
	nextUrl?: string;
	nextPage?: number;
	done: boolean;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
	return value as Record<string, unknown>;
}

export type PaginationMode = 'none' | 'laravel' | 'benefitEmployees' | 'tokenPermissions';

export function slicePage(payload: unknown, mode: PaginationMode, currentPage: number): PageSlice {
	const body = asRecord(payload) ?? {};
	if (mode === 'benefitEmployees') {
		const data = asRecord(body.data) ?? {};
		const items = Array.isArray(data.employees) ? data.employees : [];
		const nextUrl = typeof data.next_page_url === 'string' && data.next_page_url !== '' ? data.next_page_url : undefined;
		const total = typeof data.total_pages === 'number' ? data.total_pages : undefined;
		const page = typeof data.current_page === 'number' ? data.current_page : currentPage;
		const moreByCount = total !== undefined && page < total;
		return { items, nextUrl, nextPage: page + 1, done: !nextUrl && !moreByCount };
	}
	if (mode === 'tokenPermissions') {
		const data = asRecord(body.data) ?? {};
		const items = Array.isArray(data.permissions) ? data.permissions : [];
		return finishLaravel(body, items, currentPage);
	}
	const items = Array.isArray(body.data) ? body.data : body.data === undefined ? [] : [body.data];
	if (mode === 'none') return { items, done: true };
	return finishLaravel(body, items, currentPage);
}

function finishLaravel(body: Record<string, unknown>, items: unknown[], currentPage: number): PageSlice {
	const nextUrl = typeof body.next_page_url === 'string' && body.next_page_url !== '' ? body.next_page_url : undefined;
	const last = typeof body.last_page === 'number' ? body.last_page : undefined;
	const page = typeof body.current_page === 'number' ? body.current_page : currentPage;
	const done = nextUrl ? false : last === undefined ? true : page >= last;
	return { items, nextUrl, nextPage: page + 1, done };
}

export function unwrapData(payload: unknown): unknown {
	const body = asRecord(payload);
	if (!body) return payload;
	if (body.success === false) {
		const message = typeof body.message === 'string' && body.message ? body.message : 'success=false';
		const error = new Error(message);
		(error as Error & { payload?: unknown }).payload = payload;
		throw error;
	}
	if ('data' in body) return body.data;
	return body;
}

export function sameOriginNext(currentUrl: string, nextUrl: string | undefined): URL | undefined {
	if (!nextUrl) return undefined;
	const current = new URL(currentUrl);
	const next = new URL(nextUrl, current);
	if (next.origin !== current.origin) return undefined;
	return next;
}
