import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class ConveniaApi implements ICredentialType {
	name = 'conveniaApi';
	displayName = 'Convenia API';
	documentationUrl = 'https://docs-api.convenia.com.br/';
	icon: Icon = { light: 'file:convenia.svg', dark: 'file:convenia.dark.svg' };
	httpRequestNode = {
		name: 'Convenia',
		docsUrl: 'https://docs-api.convenia.com.br/',
		apiBaseUrl: 'https://public-api.convenia.com.br/api/v3',
	};
	properties: INodeProperties[] = [
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Integration token generated in Convenia. It is sent in the token header, not in Authorization. The value is omitted from error messages.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://public-api.convenia.com.br/api/v3',
			required: true,
			description:
				'Official API v3 base. HTTPS only. The credential test calls read-only GET /tokens/permissions.',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				token: '={{$credentials.token}}',
			},
		},
	};
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/tokens/permissions',
			method: 'GET',
		},
	};
}
