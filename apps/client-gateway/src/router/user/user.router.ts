import { Hono } from 'hono';
import { publicProcedure, router } from '../../lib/trpc';
import { Env } from '../../types/binding';
import { userGetAuthUrlSchema } from './user.model';

export const userRouter = {
	getAuthUrl: publicProcedure
		.input(userGetAuthUrlSchema)
		.query(async ({ input, ctx }) => {
			const authUrl = await ctx.env.USER_SERVICE.getAuthUrl(input.provider);

			return authUrl;
		}),
};

export const callbackRouter = new Hono<{ Bindings: Env }>();

callbackRouter.get('/auth/callback/google', async (c) => {
	const code = c.req.query('code');

	if (!code) {
		return c.json(
			{ success: false, error: 'Authorization code not provided' },
			400,
		);
	}

	const result = await c.env.USER_SERVICE.loginOrSignup('google', code);

	return c.json({
		user: result.user,
		refreshToken: result.refreshToken,
		accessToken: result.accessToken,
	});
});
