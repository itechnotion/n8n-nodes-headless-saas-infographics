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
			// Send a minimal invalid body — we expect a 400 (bad request) not a 401 (unauthorized).
			// A non-401 response means the key was accepted by the auth layer.
			body: { skill: '__test__', content: '__test__' },
		},
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
