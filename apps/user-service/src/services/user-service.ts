import { DrizzleD1Database } from 'drizzle-orm/d1';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { JwtService } from '@ordernary/jwt-service';

export class UserService {
	constructor(
		private readonly db: DrizzleD1Database,
		private readonly jwtService: JwtService,
	) {}

	/**
	 * Access Token으로 사용자 정보 조회
	 */
	async getCurrentUser(accessToken: string) {
		const payload = this.jwtService.verifyToken(accessToken, 'access');
		if (!payload) {
			throw new Error('Invalid access token');
		}

		const result = await this.db
			.select()
			.from(users)
			.where(eq(users.userId, payload.userId))
			.limit(1);

		if (result.length === 0) {
			throw new Error('User not found');
		}

		return result[0];
	}
}
