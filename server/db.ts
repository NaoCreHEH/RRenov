import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, services, projects, contactInfo, projectImages, aboutContent, teamMembers, InsertService, InsertProject, InsertContactInfo, InsertProjectImage, InsertAboutContent, InsertTeamMember } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Content queries
export async function getServices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(services).orderBy(services.order);
}

export async function getServiceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createService(data: InsertService) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(services).values(data);
  return result;
}

export async function updateService(id: number, data: Partial<InsertService>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(services).set(data).where(eq(services.id, id));
}

export async function deleteService(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(services).where(eq(services.id, id));
}

export async function getProjects() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).orderBy(projects.order);
}

export async function getProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProject(data: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(projects).values(data);
  return result;
}

export async function updateProject(id: number, data: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(projects).set(data).where(eq(projects.id, id));
}

export async function deleteProject(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(projects).where(eq(projects.id, id));
}

export async function getContactInfo() {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(contactInfo).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateContactInfo(data: Partial<InsertContactInfo>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getContactInfo();
  if (existing) {
    return db.update(contactInfo).set(data).where(eq(contactInfo.id, existing.id));
  } else {
    return db.insert(contactInfo).values(data as InsertContactInfo);
  }
}

// Project Images queries
export async function getProjectImages(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projectImages).where(eq(projectImages.projectId, projectId)).orderBy(projectImages.order);
}

export async function createProjectImage(data: InsertProjectImage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(projectImages).values(data);
  return result;
}

export async function deleteProjectImage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(projectImages).where(eq(projectImages.id, id));
}

export async function deleteProjectImages(projectId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(projectImages).where(eq(projectImages.projectId, projectId));
}

// About Content queries
export async function getAboutContent() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(aboutContent);
}

export async function getAboutContentBySection(section: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(aboutContent).where(eq(aboutContent.section, section)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertAboutContent(data: InsertAboutContent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getAboutContentBySection(data.section);
  if (existing) {
    return db.update(aboutContent).set(data).where(eq(aboutContent.section, data.section));
  } else {
    return db.insert(aboutContent).values(data);
  }
}

// Team Members queries
export async function getTeamMembers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teamMembers).orderBy(teamMembers.order);
}

export async function getTeamMemberById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createTeamMember(data: InsertTeamMember) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(teamMembers).values(data);
  return result;
}

export async function updateTeamMember(id: number, data: Partial<InsertTeamMember>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(teamMembers).set(data).where(eq(teamMembers.id, id));
}

export async function deleteTeamMember(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(teamMembers).where(eq(teamMembers.id, id));
}
