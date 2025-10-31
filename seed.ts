import { getDb } from "./server/db";
import { services, projects, contactInfo } from "./drizzle/schema";

async function seed() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    process.exit(1);
  }

  // Add services
  await db.insert(services).values([
    {
      title: "Gyproc et Cloisons",
      description: "Installation de cloisons en gyproc pour l'aménagement de vos combles. Travail propre et professionnel.",
      order: 1,
    },
    {
      title: "Enduit et Finitions",
      description: "Enduit de qualité pour une finition impeccable. Nous garantissons un rendu lisse et uniforme.",
      order: 2,
    },
    {
      title: "Plafonnage",
      description: "Plafonnage complet de vos combles avec des matériaux de qualité supérieure.",
      order: 3,
    },
    {
      title: "Isolation",
      description: "Isolation laine de bois et laine minérale pour une meilleure efficacité énergétique.",
      order: 4,
    },
    {
      title: "Retouche sur Plafonnage",
      description: "Retouches et réparations sur plafonnage existant avec un rendu parfait.",
      order: 5,
    },
  ]);

  // Add projects
  await db.insert(projects).values([
    {
      title: "Aménagement Comble Moderne",
      description: "Transformation complète d'un comble en espace de vie moderne avec isolation optimale.",
      order: 1,
    },
    {
      title: "Rénovation Plafonnage",
      description: "Rénovation complète du plafonnage avec finitions de qualité professionnelle.",
      order: 2,
    },
    {
      title: "Installation Cloisons Gyproc",
      description: "Création d'espaces séparés avec cloisons en gyproc pour une meilleure organisation.",
      order: 3,
    },
  ]);

  // Add contact info
  await db.insert(contactInfo).values({
    phone: "0472 65 58 73",
    email: "rommelaere.renov@gmail.com",
    address: "Belgique",
  });

  console.log("Seed completed successfully!");
}

seed().catch(console.error);
