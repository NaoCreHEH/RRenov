import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  content: router({
    getServices: publicProcedure.query(() => db.getServices()),
    getServiceById: publicProcedure.input(z.number()).query(({ input }) => db.getServiceById(input)),
    createService: protectedProcedure
      .input(z.object({ title: z.string(), description: z.string().optional(), icon: z.string().optional(), order: z.number().optional() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        return db.createService(input);
      }),
    updateService: protectedProcedure
      .input(z.object({ id: z.number(), title: z.string().optional(), description: z.string().optional(), icon: z.string().optional(), order: z.number().optional() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const { id, ...data } = input;
        return db.updateService(id, data);
      }),
    deleteService: protectedProcedure.input(z.number()).mutation(({ input, ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      return db.deleteService(input);
    }),
    getProjects: publicProcedure.query(() => db.getProjects()),
    getProjectById: publicProcedure.input(z.number()).query(({ input }) => db.getProjectById(input)),
    createProject: protectedProcedure
      .input(z.object({ title: z.string(), description: z.string().optional(), imageUrl: z.string().optional(), order: z.number().optional() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        return db.createProject(input);
      }),
    updateProject: protectedProcedure
      .input(z.object({ id: z.number(), title: z.string().optional(), description: z.string().optional(), imageUrl: z.string().optional(), order: z.number().optional() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const { id, ...data } = input;
        return db.updateProject(id, data);
      }),
    deleteProject: protectedProcedure.input(z.number()).mutation(({ input, ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      return db.deleteProject(input);
    }),
    getContactInfo: publicProcedure.query(() => db.getContactInfo()),
    updateContactInfo: protectedProcedure
      .input(z.object({ phone: z.string().optional(), email: z.string().optional(), address: z.string().optional() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        return db.updateContactInfo(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
