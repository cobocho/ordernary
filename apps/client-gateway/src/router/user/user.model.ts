import { z } from 'zod';
import { userSelectSchema } from '../../../../user-service/src/db/schema';

export const userGetAuthUrlRequestSchema = z.object({
	provider: z.enum(['google', 'kakao', 'apple', 'naver']),
	client: z.enum(['console', 'app']),
	returnTo: z.string(),
});

export const userGetAuthUrlResponseSchema = z.object({
	authUrl: z.string(),
});

export const userGetProfileResponseSchema = userSelectSchema;
