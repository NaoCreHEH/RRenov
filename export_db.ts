import { getDb } from "./server/db";
import * as fs from "fs";

async function exportDatabase() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    process.exit(1);
  }

  try {
    // Get all data from tables
    const usersData = await db.query.users.findMany();
    const servicesData = await db.query.services.findMany();
    const projectsData = await db.query.projects.findMany();
    const contactInfoData = await db.query.contactInfo.findMany();

    // Create SQL dump
    let sqlDump = "-- Rommelaere Rénov Database Export\n";
    sqlDump += `-- Generated on ${new Date().toISOString()}\n\n`;

    // Services
    sqlDump += "-- Services\n";
    servicesData.forEach((service: any) => {
      const desc = service.description ? service.description.replace(/'/g, "''") : "";
      sqlDump += `INSERT INTO services (id, title, description, \`order\`, createdAt, updatedAt) VALUES (${service.id}, '${service.title}', '${desc}', ${service.order || 1}, NOW(), NOW());\n`;
    });

    // Projects
    sqlDump += "\n-- Projects\n";
    projectsData.forEach((project: any) => {
      const desc = project.description ? project.description.replace(/'/g, "''") : "";
      const img = project.imageUrl ? project.imageUrl.replace(/'/g, "''") : "";
      sqlDump += `INSERT INTO projects (id, title, description, imageUrl, \`order\`, createdAt, updatedAt) VALUES (${project.id}, '${project.title}', '${desc}', '${img}', ${project.order || 1}, NOW(), NOW());\n`;
    });

    // Contact Info
    sqlDump += "\n-- Contact Info\n";
    contactInfoData.forEach((contact: any) => {
      const phone = contact.phone ? contact.phone.replace(/'/g, "''") : "";
      const email = contact.email ? contact.email.replace(/'/g, "''") : "";
      const addr = contact.address ? contact.address.replace(/'/g, "''") : "";
      sqlDump += `INSERT INTO contactInfo (id, phone, email, address, createdAt, updatedAt) VALUES (${contact.id}, '${phone}', '${email}', '${addr}', NOW(), NOW());\n`;
    });

    // Write to file
    fs.writeFileSync("/home/ubuntu/rommelaere-renov/database_export.sql", sqlDump);
    console.log("Database exported successfully to database_export.sql");
  } catch (error) {
    console.error("Error exporting database:", error);
    process.exit(1);
  }
}

exportDatabase();
