import { z } from 'zod';

export const userGetAuthUrlRequestSchema = z.object({
	provider: z.enum(['google', 'kakao', 'apple', 'naver']),
	client: z.enum(['console', 'app']),
	returnTo: z.string(),
});

export const userGetAuthUrlResponseSchema = z.object({
	authUrl: z.string(),
});
