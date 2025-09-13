import { z } from 'zod';

export const userGetAuthUrlSchema = z.object({
	provider: z.enum(['google', 'kakao', 'apple', 'naver']),
});
