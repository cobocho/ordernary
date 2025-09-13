import { OAuthProvider } from './oauth-provider';
import { google } from 'googleapis';

export class GoogleProvider implements OAuthProvider {
	public readonly provider = 'google';

	constructor(
		private clientId: string,
		private clientSecret: string,
		private redirectUri: string,
	) {}

	getAuthUrl(): string {
		const client = new google.auth.OAuth2(
			this.clientId,
			this.clientSecret,
			this.redirectUri,
		);

		const authUrl = client.generateAuthUrl({
			access_type: 'offline',
			scope: [
				'https://www.googleapis.com/auth/userinfo.profile',
				'https://www.googleapis.com/auth/userinfo.email',
			],
		});

		return authUrl;
	}

	async getUserInfo(code: string) {
		const client = new google.auth.OAuth2(
			this.clientId,
			this.clientSecret,
			this.redirectUri,
		);

		const { tokens } = await client.getToken(code);
		client.setCredentials(tokens);

		if (!tokens.access_token) {
			throw new Error('Invalid token');
		}

		const oauth2 = google.oauth2({ auth: client, version: 'v2' });
		const { data } = await oauth2.userinfo.get();

		if (!data.id || !data.email || !data.name) {
			throw new Error('Invalid user info');
		}

		return {
			id: data.id,
			email: data.email,
			name: data.name,
			avatarUrl: data.picture ?? '',
		};
	}
}
