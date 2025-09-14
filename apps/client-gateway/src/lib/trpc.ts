import { initTRPC, TRPCError } from '@trpc/server';
import { HonoContext } from '@/types/binding';

export const t = initTRPC.context<HonoContext>().create();
export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.cookies.accessToken || !ctx.cookies.refreshToken) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}

	const isVerified = ctx.JWT_SERVICE.verifyToken(
		ctx.cookies.accessToken,
		'access',
	);

	if (!isVerified) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}

	return next({ ctx });
});
