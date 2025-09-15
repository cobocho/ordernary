import { Hono } from 'hono';
import { callbackRouter, userRouter } from './router/user/user.router';
import { trpcServer } from '@hono/trpc-server';
import { cors } from 'hono/cors';
import { Env, HonoContext } from './types/binding';
import { getCookie } from 'hono/cookie';
import { JwtService } from '@ordernary/jwt-service';
import ms from 'ms';
import { router, protectedProcedure } from './lib/trpc';

const app = new Hono<{ Bindings: Env }>();

const ALLOWED = ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(
	'*',
	cors({
		origin: (origin) => (origin && ALLOWED.includes(origin) ? origin : ''),
		credentials: true, // <- 중요: Allow-Credentials: true
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
		exposeHeaders: ['Content-Type', 'Authorization'],
		maxAge: 600,
	}),
);

app.get('/', (c) => {
	return c.json({
		message: 'Client Gateway is running',
		version: '0.0.1',
		status: 'healthy',
	});
});

export const appRouter = router({
	user: userRouter,
	hello: protectedProcedure.query(({ ctx }) => {
		return {
			message: 'Hello, world!',
		};
	}),
});

export type AppRouter = typeof appRouter;

app.route('/auth/callback', callbackRouter);

app.use(
	'/trpc/*',
	trpcServer({
		router: appRouter,
		createContext: (_, c) => {
			return {
				env: c.env,
				cookies: {
					accessToken: getCookie(c, JwtService.accessTokenCookieName) ?? '',
					refreshToken: getCookie(c, JwtService.refreshTokenCookieName) ?? '',
				},
				JWT_SERVICE: new JwtService(
					c.env.JWT_SECRET,
					c.env.JWT_ISSUER,
					c.env.JWT_ACCESS_TOKEN_EXPIRES_IN as ms.StringValue,
					c.env.JWT_REFRESH_TOKEN_EXPIRES_IN as ms.StringValue,
				),
			} satisfies HonoContext;
		},
	}),
);

export default app;
