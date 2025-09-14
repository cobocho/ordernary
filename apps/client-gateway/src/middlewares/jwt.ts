// // jwtMiddleware.ts (검증 전용)
// import { t } from '..';
// import { JwtPayload, JwtService } from '@ordernary/jwt-service';
// import ms from 'ms';

// export const jwtMiddleware = t.middleware(async ({ ctx, next }) => {
// 	const jwtService = new JwtService(
// 		ctx.env.JWT_SECRET,
// 		ctx.env.JWT_ISSUER,
// 		ctx.env.JWT_ACCESS_TOKEN_EXPIRES_IN as ms.StringValue,
// 		ctx.env.JWT_REFRESH_TOKEN_EXPIRES_IN as ms.StringValue,
// 	);

// 	const req = (ctx as unknown as { req: Request }).req;

// 	const accessToken = req.headers.get(JwtService.accessTokenCookieName);
// 	const refreshToken = req.headers.get(JwtService.refreshTokenCookieName);

// 	return next({ ctx: { ...ctx } });
// });
