import type { ICredentialType, INodeProperties, Icon } from 'n8n-workflow';

export class ConveniaWebhookApi implements ICredentialType {
	name = 'conveniaWebhookApi';
	displayName = 'Convenia Webhook API';
	documentationUrl = 'https://docs-api.convenia.com.br/#admissao-iniciada';
	icon: Icon = { light: 'file:convenia.svg', dark: 'file:convenia.dark.svg' };
	properties: INodeProperties[] = [
		{
			displayName: 'Signing Secret',
			name: 'secret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Secret configured on the Convenia webhook. The check uses the Spatie library default: HMAC-SHA256 of the raw body compared with the Signature header. Convenia names that library and header but does not publish a test vector, so the check is not sandbox-verified.',
		},
	];
}
