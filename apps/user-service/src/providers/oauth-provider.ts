import { ProviderType } from '../db/schema';

export interface OAuthProvider {
	provider: ProviderType;
	getAuthUrl(): string;
	getUserInfo(token: string): Promise<{
		id: string;
		name: string;
		email: string;
		avatarUrl: string;
	}>;
}
