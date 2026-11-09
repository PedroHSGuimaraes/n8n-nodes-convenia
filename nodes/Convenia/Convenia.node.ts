import {
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
	sleep,
	type IDataObject,
	type IExecuteFunctions,
	type IHttpRequestMethods,
	type IHttpRequestOptions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';

import { buildRequest } from './api/buildRequest';
import { ConveniaInputError } from './api/errors';
import { redactText } from './api/redact';
import {
	assertBaseUrl,
	ConveniaApiError,
	limiterFor,
	performRequest,
	type CallOptions,
	type RawResponse,
} from './api/transport';
import { buildNodeProperties, locatorNames, parameterNames } from './description/properties';
import { listSearch, loadOptions } from './methods';
import { operations, resources } from './spec/operations';

const orderedResources = [...resources].sort((left, right) => left.name.localeCompare(right.name, 'en'));

function binaryKey(name: string): string {
	if (name === '__proto__' || name === 'constructor' || name === 'prototype') return 'data';
	return name;
}

function failureMessage(error: unknown): string {
	if (error instanceof ConveniaApiError || error instanceof ConveniaInputError) return error.message;
	if (error instanceof Error) return redactText(error.message);
	return 'Falha ao executar a Convenia.';
}

export class Convenia implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Convenia',
		name: 'convenia',
		icon: { light: 'file:convenia.svg', dark: 'file:convenia.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description:
			'Reads and updates the Convenia public API v3: employees, admission, dismissal, vacation, benefits, organization, payroll, and catalogs.',
		defaults: { name: 'Convenia' },
		usableAsTool: {
			replacements: {
				description:
					'Convenia API v3 tool. Prefer read operations. HR writes (admission, dismissal, salary, documents, benefits, and deletes) change personal data and must run only after a person confirms. Do not invent IDs: use a list or ask for the UUID. The documented limit is 50 requests per minute inside one API token, and this process does not share that budget with other n8n workers. Binary upload and download are a poor fit for an agent.',
			},
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'conveniaApi', required: true }],
		codex: {
			categories: ['Productivity', 'Data & Storage'],
			resources: {
				primaryDocumentation: [{ url: 'https://docs-api.convenia.com.br/' }],
			},
		},
		properties: buildNodeProperties(orderedResources, operations),
	};

	methods = { loadOptions, listSearch };

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('conveniaApi');
		const baseUrl = assertBaseUrl(credentials.baseUrl);
		const credentialId = this.getNode().credentials?.conveniaApi?.id;
		const limiter = limiterFor(typeof credentialId === 'string' ? credentialId : undefined);
		const call = async (options: CallOptions): Promise<RawResponse> => {
			const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'conveniaApi', {
				method: options.method as IHttpRequestMethods,
				url: options.url,
				qs: options.qs,
				body: options.body as IHttpRequestOptions['body'],
				headers: options.headers,
				encoding: options.encoding,
				json: options.json,
				timeout: options.timeout,
				returnFullResponse: true,
				ignoreHttpStatusErrors: true,
			})) as RawResponse;
			return {
				statusCode: response.statusCode,
				headers: response.headers ?? {},
				body: response.body,
			};
		};

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				const spec = operations.find((item) => item.resource === resource && item.operation === operation);
				if (!spec) {
					throw new NodeOperationError(this.getNode(), 'Operação não suportada.', { itemIndex: i });
				}
				const params: Record<string, unknown> = {};
				const locators = new Set(locatorNames(spec));
				for (const name of parameterNames(spec)) {
					params[name] = this.getNodeParameter(name, i, undefined, { extractValue: locators.has(name) });
				}
				const request = buildRequest(resource, operation, params);
				const file = request.multipart
					? await readUpload(this, i, binaryKey(request.binaryProperty), request.fileName)
					: undefined;
				const result = await performRequest({ call, limiter, sleep, baseUrl, request, file });
				if (result.kind === 'binary') {
					const property = binaryKey(request.binaryProperty);
					const binary = await this.helpers.prepareBinaryData(result.buffer, result.fileName, result.mimeType);
					returnData.push({
						json: { fileName: result.fileName, mimeType: result.mimeType, size: result.buffer.length },
						binary: { [property]: binary },
						pairedItem: { item: i },
					});
					continue;
				}
				for (const item of result.items) {
					const json =
						item && typeof item === 'object' && !Array.isArray(item)
							? (item as IDataObject)
							: { data: item as IDataObject['data'] };
					returnData.push({ json, pairedItem: { item: i } });
				}
			} catch (error) {
				const message = failureMessage(error);
				if (this.continueOnFail()) {
					returnData.push({ json: { message }, pairedItem: { item: i } });
					continue;
				}
				if (error instanceof ConveniaInputError || error instanceof NodeOperationError) {
					throw new NodeOperationError(this.getNode(), message, { itemIndex: i });
				}
				throw new NodeApiError(this.getNode(), { message }, { itemIndex: i, message });
			}
		}

		return [returnData];
	}
}

async function readUpload(ctx: IExecuteFunctions, itemIndex: number, property: string, fileName: string | undefined) {
	const binary = ctx.helpers.assertBinaryData(itemIndex, property);
	const buffer = await ctx.helpers.getBinaryDataBuffer(itemIndex, property);
	return {
		buffer,
		fileName: fileName || binary.fileName || 'anexo.bin',
		mimeType: binary.mimeType,
	};
}
