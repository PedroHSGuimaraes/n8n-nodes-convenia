import {
	NodeConnectionTypes,
	type IHookFunctions,
	type ICredentialTestFunctions,
	type ICredentialsDecrypted,
	type ICredentialDataDecryptedObject,
	type IDataObject,
	type INodeCredentialTestResult,
	type INodeType,
	type INodeTypeDescription,
	type IWebhookFunctions,
	type IWebhookResponseData,
} from 'n8n-workflow';

import { WEBHOOK_EVENTS, evaluateWebhook } from '../Convenia/api/webhook';

function headerValue(headers: Record<string, string | string[] | undefined>, name: string): string | undefined {
	const match = Object.keys(headers).find((key) => key.toLowerCase() === name.toLowerCase());
	if (!match) return undefined;
	const value = headers[match];
	if (Array.isArray(value)) return value[0];
	if (typeof value === 'string') return value;
	return undefined;
}

async function rawBodyOf(req: {
	rawBody?: Buffer | string;
	readRawBody?: () => Promise<void>;
}): Promise<string | undefined> {
	if (req.rawBody === undefined && typeof req.readRawBody === 'function') {
		await req.readRawBody();
	}
	if (typeof req.rawBody === 'string') return req.rawBody;
	if (Buffer.isBuffer(req.rawBody)) return req.rawBody.toString('utf8');
	return undefined;
}

export class ConveniaTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Convenia Trigger',
		name: 'conveniaTrigger',
		icon: { light: 'file:convenia.svg', dark: 'file:convenia.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"]}}',
		description: 'Receives Convenia webhooks. Register the production URL manually in Convenia. Activation does not call the API.',
		defaults: { name: 'Convenia Trigger' },
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'conveniaWebhookApi', required: true, testedBy: 'conveniaWebhookApiTest' }],
		codex: {
			categories: ['Productivity'],
			resources: {
				primaryDocumentation: [{ url: 'https://docs-api.convenia.com.br/#admissao-iniciada' }],
			},
		},
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'convenia',
			},
		],
		properties: [
			{
				displayName:
					'Convenia does not document an endpoint that registers webhooks. Activate the workflow, copy this production URL, and register it in Convenia with the same signing secret. Activation does not call the API. The official birthday example is not valid JSON and has no type, so it is rejected. Signature checking follows the Spatie library default and is not sandbox-verified.',
				name: 'noticeRegistration',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				default: [],
				description:
					'Leave empty to accept every payload that has a type string. An event outside the list returns 200 and does not start the workflow. Identical payloads are not dropped, because Convenia does not publish a delivery ID.',
				options: WEBHOOK_EVENTS.filter((event) => event.type).map((event) => ({
					name: event.name,
					value: event.value,
					description: `Documented type ${event.type}`,
				})),
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				return true;
			},
		},
	};

	methods = {
		credentialTest: {
			async conveniaWebhookApiTest(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted<ICredentialDataDecryptedObject>,
			): Promise<INodeCredentialTestResult> {
				const secret = credential.data?.secret;
				if (typeof secret !== 'string' || secret.trim() === '') {
					return {
						status: 'Error',
						message:
							'Enter the signing secret. Convenia does not document an endpoint that can test this secret.',
					};
				}
				return {
					status: 'OK',
					message:
						'Secret is present. It is checked only when a webhook arrives, using the unverified Spatie default. No API call was made.',
				};
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const credentials = await this.getCredentials('conveniaWebhookApi');
		const secret = typeof credentials.secret === 'string' ? credentials.secret : '';
		const allowed = this.getNodeParameter('events', []) as string[];
		const req = this.getRequestObject() as {
			rawBody?: Buffer | string;
			readRawBody?: () => Promise<void>;
		};
		const headers = this.getHeaderData();
		const decision = evaluateWebhook({
			rawBody: await rawBodyOf(req),
			signature: headerValue(headers, 'signature'),
			contentType: headerValue(headers, 'content-type'),
			secret,
			allowed,
		});
		if (!decision.ok) {
			this.getResponseObject().status(decision.status).json({ message: decision.message });
			return { noWebhookResponse: true };
		}
		const json: IDataObject = { event: decision.event, body: decision.body };
		return { workflowData: [[{ json }]] };
	}
}
