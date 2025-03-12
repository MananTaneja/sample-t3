import { eq } from 'drizzle-orm';
import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { users } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        return await ctx.db.query.users.findMany();
    }),

    getCurrentUser: protectedProcedure.query(({ ctx }) => {
        return ctx.session.user;
    }),

    updateName: protectedProcedure
        .input(z.object({ name: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.update(users).set({ name: input.name }).where(eq(users.id, ctx.session.user.id));
            return { success: true };
        }),
});
