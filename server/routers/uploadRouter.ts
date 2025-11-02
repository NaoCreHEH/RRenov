// RRenov/server/routers/uploadRouter.ts
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { nanoid } from "nanoid";
import { projects } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

// Ce routeur gère l'enregistrement de l'URL de l'image dans la base de données
export const uploadRouter = router({
  // Procédure pour enregistrer l'URL d'une image uploadée dans un projet
  registerProjectImage: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        imageUrl: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // *** NOTE IMPORTANTE ***
      // L'implémentation réelle nécessiterait une modification du schéma Drizzle
      // pour gérer les images multiples par projet.
      // Pour l'instant, nous simulons l'enregistrement.
      
      // Si le projet a un champ 'image' (ce qui n'est pas le cas dans le schéma actuel)
      // await ctx.db.update(projects)
      //   .set({ image: input.imageUrl })
      //   .where(eq(projects.id, input.projectId));

      return { success: true, imageUrl: input.imageUrl };
    }),
});

// Ce fichier ne gère pas l'upload physique, qui est géré par un middleware Express.
// Il gère uniquement la logique métier après l'upload.
