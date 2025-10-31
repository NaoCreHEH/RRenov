/**
 * Script de seed complet pour la base de données Rommelaere Rénov
 * Exécutez avec: tsx seed_complete.ts
 */

import { drizzle } from "drizzle-orm/mysql2";
import { services, projects, contactInfo, aboutContent, teamMembers, projectImages } from "./drizzle/schema";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL n'est pas définie dans les variables d'environnement");
  process.exit(1);
}

async function seed() {
  console.log("🌱 Début du seed de la base de données...");
  
  const db = drizzle(DATABASE_URL);

  try {
    // 1. Services
    console.log("📦 Insertion des services...");
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
    console.log("✅ Services insérés");

    // 2. Projets
    console.log("📦 Insertion des projets...");
    await db.insert(projects).values([
      {
        title: "Restauration Complète d'une Chambre",
        description: "Rénovation intégrale d'une chambre avec gyproc, enduit et finitions impeccables. Transformation d'un espace en pièce de vie moderne et confortable.",
        imageUrl: "/projects/chambre/1.jpg",
        order: 1,
      },
      {
        title: "Crépi sur Façade",
        description: "Application de crépi de qualité supérieure sur façade. Finition professionnelle garantissant durabilité et esthétique.",
        imageUrl: "/projects/crepis/1.jpg",
        order: 2,
      },
      {
        title: "Caisson Îlot Central",
        description: "Création d'un caisson de rangement intégré suivant l'îlot central. Travail de précision avec finitions soignées.",
        imageUrl: "/projects/caisson/1.jpg",
        order: 3,
      },
      {
        title: "Aménagement Suite Parentale",
        description: "Création intégrale d'une chambre parentale dans un grenier non aménagé",
        imageUrl: "/projects/suite-parentale/1.jpg",
        order: 4,
      },
    ]);
    console.log("✅ Projets insérés");

    // 3. Images des projets (exemple - à adapter selon vos images réelles)
    console.log("📦 Insertion des images des projets...");
    
    // Projet 1: Restauration Complète d'une Chambre (7 images)
    const chambreImages = Array.from({ length: 7 }, (_, i) => ({
      projectId: 1,
      imageUrl: `/projects/chambre/${i + 1}.jpg`,
      order: i,
    }));
    
    // Projet 2: Crépi sur Façade (4 images)
    const crepisImages = Array.from({ length: 4 }, (_, i) => ({
      projectId: 2,
      imageUrl: `/projects/crepis/${i + 1}.jpg`,
      order: i,
    }));
    
    // Projet 3: Caisson Îlot Central (6 images)
    const caissonImages = Array.from({ length: 6 }, (_, i) => ({
      projectId: 3,
      imageUrl: `/projects/caisson/${i + 1}.jpg`,
      order: i,
    }));
    
    // Projet 4: Aménagement Suite Parentale (3 images)
    const suiteImages = Array.from({ length: 3 }, (_, i) => ({
      projectId: 4,
      imageUrl: `/projects/suite-parentale/${i + 1}.jpg`,
      order: i,
    }));

    await db.insert(projectImages).values([
      ...chambreImages,
      ...crepisImages,
      ...caissonImages,
      ...suiteImages,
    ]);
    console.log("✅ Images des projets insérées");

    // 4. Contenu "À propos"
    console.log("📦 Insertion du contenu 'À propos'...");
    await db.insert(aboutContent).values([
      {
        section: "header",
        title: "À Propos de Nous",
        content: "Votre partenaire de confiance pour l'aménagement de combles",
      },
      {
        section: "who_we_are",
        title: "Qui Sommes-Nous ?",
        content: "Rommelaere Rénov est une entreprise spécialisée dans l'aménagement de combles depuis plus de 10 ans. Nous mettons notre expertise et notre passion au service de vos projets de rénovation.",
      },
      {
        section: "expertise",
        title: "Notre Expertise",
        content: "Nous maîtrisons tous les aspects de l'aménagement de combles :\n- Gyproc et cloisons\n- Enduit et finitions\n- Retouche sur plafonnage\n- Cimentage et travaux de base\n- Crépi sur isolant\n- Plafonnage\n- Isolation laine de bois et laine minérale",
      },
      {
        section: "values",
        title: "Nos Valeurs",
        content: "Qualité, professionnalisme et satisfaction client sont au cœur de nos valeurs. Nous nous engageons à livrer des travaux impeccables dans les délais convenus.",
      },
    ]);
    console.log("✅ Contenu 'À propos' inséré");

    // 5. Membres de l'équipe
    console.log("📦 Insertion des membres de l'équipe...");
    await db.insert(teamMembers).values([
      {
        name: "Matthias Rommelaere",
        role: "Fondateur et gérant",
        bio: "Fondateur et gérant de Rommelaere Rénov, Matthias apporte plus de 10 ans d'expérience dans le domaine de la rénovation et de l'aménagement de combles.\n\nPassionné par son métier, il s'engage à fournir des solutions de qualité supérieure à chacun de ses clients. Son attention aux détails et son professionnalisme font la différence dans chaque projet.\n\nMatthias croit que chaque projet est unique et mérite une approche personnalisée pour garantir la satisfaction totale du client.",
        imageUrl: "/matthias.png",
        order: 1,
      },
    ]);
    console.log("✅ Membres de l'équipe insérés");

    // 6. Informations de contact
    console.log("📦 Insertion des informations de contact...");
    await db.insert(contactInfo).values([
      {
        phone: "0472 65 58 73",
        email: "rommelaere.renov@gmail.com",
        address: "Belgique",
      },
    ]);
    console.log("✅ Informations de contact insérées");

    console.log("\n🎉 Seed terminé avec succès !");
    console.log("\n📊 Résumé:");
    console.log("  - 5 services");
    console.log("  - 4 projets");
    console.log("  - 20 images de projets");
    console.log("  - 4 sections 'À propos'");
    console.log("  - 1 membre de l'équipe");
    console.log("  - 1 ensemble d'informations de contact");
    
  } catch (error) {
    console.error("❌ Erreur lors du seed:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("\n✨ Base de données prête à l'emploi !");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Échec du seed:", error);
    process.exit(1);
  });
