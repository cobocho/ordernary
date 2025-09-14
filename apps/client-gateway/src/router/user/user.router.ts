import { publicProcedure } from '@/lib/trpc';
import { userGetAuthUrlSchema } from '@/router/user/user.model';
import { router } from '@/lib/trpc';
import { Hono } from 'hono';
import { Env } from '@/types/binding';
import { setCookie } from 'hono/cookie';
import { durToSeconds } from '@/lib/ms';
import { JwtService } from '@ordernary/jwt-service';

export const userRouter = router({
	getAuthUrl: publicProcedure
		.input(userGetAuthUrlSchema)
		.query(async ({ input, ctx }) => {
			console.log(ctx.cookies);
			const authUrl = await ctx.env.USER_SERVICE.getAuthUrl(
				input.provider,
				input.client,
				input.returnTo,
			);
			return authUrl;
		}),
});

export const callbackRouter = new Hono<{ Bindings: Env }>();

callbackRouter.get('/google', async (c) => {
	const code = c.req.query('code');
	const state = c.req.query('state');

	if (!code || !state) {
		return c.json(
			{ success: false, error: 'Authorization code not provided' },
			400,
		);
	}

	const result = await c.env.USER_SERVICE.handleCallback('google', code, state);

	console.log(result);

	setCookie(c, JwtService.accessTokenCookieName, result.auth.accessToken, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'None',
		maxAge: durToSeconds(c.env.JWT_ACCESS_TOKEN_EXPIRES_IN),
	});

	setCookie(c, JwtService.refreshTokenCookieName, result.auth.refreshToken, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'None',
		maxAge: durToSeconds(c.env.JWT_REFRESH_TOKEN_EXPIRES_IN),
	});

	return c.redirect(result.redirectTo);
});
