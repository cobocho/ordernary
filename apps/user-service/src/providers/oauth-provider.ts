import { ProviderType } from '../db/schema';

export interface UserInfo {
	id: string;
	name: string;
	email: string;
	avatarUrl: string;
}

export interface OAuthProvider {
	provider: ProviderType;

	// 로그인 시작: 서명된 state 문자열을 그대로 전달
	getAuthUrl(state: string): string;

	// 콜백 처리: code로 사용자 정보 조회
	getUserInfoByCode(code: string): Promise<UserInfo>;
}
