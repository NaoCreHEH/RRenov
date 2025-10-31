import { getDb } from "./server/db";
import { projects } from "./drizzle/schema";
import { eq } from "drizzle-orm";

async function updateProjects() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    process.exit(1);
  }

  // Get all projects
  const allProjects = await db.select().from(projects);

  if (allProjects.length >= 1) {
    await db.update(projects).set({
      title: "Restauration Complète d'une Chambre",
      description: "Rénovation intégrale d'une chambre avec gyproc, enduit et finitions impeccables. Transformation d'un espace en pièce de vie moderne et confortable.",
    }).where(eq(projects.id, allProjects[0].id));
  }

  if (allProjects.length >= 2) {
    await db.update(projects).set({
      title: "Crépi sur Façade",
      description: "Application de crépi de qualité supérieure sur façade. Finition professionnelle garantissant durabilité et esthétique.",
    }).where(eq(projects.id, allProjects[1].id));
  }

  if (allProjects.length >= 3) {
    await db.update(projects).set({
      title: "Caisson Îlot Central",
      description: "Création d'un caisson de rangement intégré suivant l'îlot central. Travail de précision avec finitions soignées.",
    }).where(eq(projects.id, allProjects[2].id));
  }

  if (allProjects.length >= 4) {
    await db.update(projects).set({
      title: "Aménagement Suite Parentale",
      description: "Transformation complète d'un comble en suite parentale luxueuse. Isolation, gyproc, enduit et finitions de haut standing.",
    }).where(eq(projects.id, allProjects[3].id));
  }

  console.log("Projects updated successfully!");
}

updateProjects().catch(console.error);
