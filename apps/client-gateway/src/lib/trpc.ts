import { initTRPC } from '@trpc/server';
import { HonoContext } from '@/types/binding';

export const t = initTRPC.context<HonoContext>().create();
export const router = t.router;
export const publicProcedure = t.procedure;
