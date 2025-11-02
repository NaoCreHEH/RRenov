import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { uploadRouter } from "./routers/uploadRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server"; 


export const appRouter = router({
  sytem : uploadRouter,
  system: systemRouter,
  auth: router({
   // me: publicProcedure.query(opts => opts.ctx.user),

    me: publicProcedure.query(({ ctx }) => {
  // empêcher le 304
  ctx.res?.setHeader?.("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  ctx.res?.setHeader?.("Pragma", "no-cache");
  ctx.res?.setHeader?.("Expires", "0");
  ctx.res?.app?.set?.("etag", false);

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return { user: ctx.user };
}),

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
    
    // Project Images
    getProjectImages: publicProcedure.input(z.number()).query(({ input }) => db.getProjectImages(input)),
    createProjectImage: protectedProcedure
      .input(z.object({ projectId: z.number(), imageUrl: z.string(), order: z.number().optional() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        return db.createProjectImage(input);
      }),
    deleteProjectImage: protectedProcedure.input(z.number()).mutation(({ input, ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      return db.deleteProjectImage(input);
    }),
    deleteProjectImages: protectedProcedure.input(z.number()).mutation(({ input, ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      return db.deleteProjectImages(input);
    }),
    
    // About Content
    getAboutContent: publicProcedure.query(() => db.getAboutContent()),
    getAboutContentBySection: publicProcedure.input(z.string()).query(({ input }) => db.getAboutContentBySection(input)),
    upsertAboutContent: protectedProcedure
      .input(z.object({ section: z.string(), title: z.string().optional(), content: z.string().optional() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        return db.upsertAboutContent(input);
      }),
    
    // Team Members
    getTeamMembers: publicProcedure.query(() => db.getTeamMembers()),
    getTeamMemberById: publicProcedure.input(z.number()).query(({ input }) => db.getTeamMemberById(input)),
    createTeamMember: protectedProcedure
      .input(z.object({ name: z.string(), role: z.string().optional(), bio: z.string().optional(), imageUrl: z.string().optional(), order: z.number().optional() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        return db.createTeamMember(input);
      }),
    updateTeamMember: protectedProcedure
      .input(z.object({ id: z.number(), name: z.string().optional(), role: z.string().optional(), bio: z.string().optional(), imageUrl: z.string().optional(), order: z.number().optional() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const { id, ...data } = input;
        return db.updateTeamMember(id, data);
      }),
    deleteTeamMember: protectedProcedure.input(z.number()).mutation(({ input, ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      return db.deleteTeamMember(input);
    }),
  }),
    // Testimonials
    testimonials: router({
    list: publicProcedure.query(() => db.getTestimonials()),
    listAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return db.getAllTestimonials();
    }),
    create: protectedProcedure
      .input(z.object({
        clientName: z.string().min(1),
        clientRole: z.string().optional(),
        projectType: z.string().optional(),
        content: z.string().min(10),
        rating: z.number().min(1).max(5).default(5),
        imageUrl: z.string().optional(),
        order: z.number().default(0),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await db.createTestimonial(input);
        return { success: true };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        clientName: z.string().optional(),
        clientRole: z.string().optional(),
        projectType: z.string().optional(),
        content: z.string().optional(),
        rating: z.number().min(1).max(5).optional(),
        imageUrl: z.string().optional(),
        order: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { id, ...data } = input;
        await db.updateTestimonial(id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await db.deleteTestimonial(input.id);
        return { success: true };
      }),
    togglePublished: protectedProcedure
      .input(z.object({ id: z.number(), isPublished: z.boolean() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await db.toggleTestimonialPublished(input.id, input.isPublished);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
