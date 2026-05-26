import type {
	ICredentialType,
	INodeProperties,
	ICredentialTestRequest,
	IAuthenticateGeneric,
} from 'n8n-workflow';

export class HeadlessSaasApi implements ICredentialType {
	name = 'headlessSaasApi';
	displayName = 'Headless SaaS API';
	documentationUrl = 'https://headless-sass-bzzrfsh6ra-el.a.run.app/docs';

	icon = {
		light: 'file:../nodes/HeadlessSaas/logo.svg',
		dark: 'file:../nodes/HeadlessSaas/logo.dark.svg',
	} as const;

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			method: 'POST',
			baseURL: 'https://headless-sass-bzzrfsh6ra-el.a.run.app',
			url: '/api/v1/generate-image',
			ignoreHttpStatusErrors: true,
			// Expect 400 for test payload with valid key, 401 for invalid key.
			body: { skill: '__test__', content: '__test__' },
		},
		rules: [
			{
				type: 'responseCode',
				properties: {
					value: 401,
					message: 'Invalid API key',
				},
			},
		],
	};

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
			required: true,
			typeOptions: { password: true },
			description:
				'Your Headless SaaS API key (starts with <code>pxl_live_</code>). ' +
				'Generate one from the <a href="https://headless-sass-bzzrfsh6ra-el.a.run.app/api-keys" target="_blank">API Keys</a> page.',
		},
	];
}
