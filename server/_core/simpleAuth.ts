/**
 * Système d'authentification simple avec email/mot de passe
 * Remplace l'OAuth Manus pour simplifier l'administration
 */

import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production";
const SALT_ROUNDS = 10;

// Credentials admin par défaut (à changer via variables d'environnement)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@rommelaere-renov.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

interface SessionPayload {
  userId: number;
  email: string;
  role: string;
}

/**
 * Crée un token JWT pour la session
 */
function createSessionToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "365d", // 1 an
  });
}

/**
 * Vérifie et décode un token JWT
 */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Hash un mot de passe avec bcrypt
 */
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare un mot de passe avec son hash
 */
async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Initialise l'utilisateur admin par défaut
 */
export async function initializeAdminUser() {
  try {
    // Vérifier si un admin existe déjà
    const existingAdmin = await db.getUserByEmail(ADMIN_EMAIL);
    
    if (!existingAdmin) {
      console.log("[SimpleAuth] Creating default admin user...");
      const hashedPassword = await hashPassword(ADMIN_PASSWORD);
      
      await db.createAdminUser({
        email: ADMIN_EMAIL,
        password: hashedPassword,
        name: "Administrateur",
        role: "admin",
      });
      
      console.log("[SimpleAuth] Default admin user created");
      console.log("[SimpleAuth] Email:", ADMIN_EMAIL);
      console.log("[SimpleAuth] Password:", ADMIN_PASSWORD);
      console.log("[SimpleAuth] ⚠️  IMPORTANT: Change the password after first login!");
    } else {
      console.log("[SimpleAuth] Admin user already exists");
    }
  } catch (error) {
    console.error("[SimpleAuth] Failed to initialize admin user:", error);
  }
}

/**
 * Enregistre les routes d'authentification
 */
export function registerSimpleAuthRoutes(app: Express) {
  
  // Route de login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email et mot de passe requis" });
      return;
    }

    try {
      // Récupérer l'utilisateur
      const user = await db.getUserByEmail(email);

      if (!user || !user.password) {
        res.status(401).json({ error: "Email ou mot de passe incorrect" });
        return;
      }

      // Vérifier le mot de passe
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({ error: "Email ou mot de passe incorrect" });
        return;
      }

      // Mettre à jour la date de dernière connexion
      await db.updateUserLastSignIn(user.id);

      // Créer le token de session
      const sessionToken = createSessionToken({
        userId: user.id,
        email: user.email!,
        role: user.role,
      });

      // Définir le cookie de session
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("[SimpleAuth] Login failed:", error);
      res.status(500).json({ error: "Erreur lors de la connexion" });
    }
  });

  // Route de changement de mot de passe
  app.post("/api/auth/change-password", async (req: Request, res: Response) => {
    const sessionToken = req.cookies[COOKIE_NAME];

    if (!sessionToken) {
      res.status(401).json({ error: "Non authentifié" });
      return;
    }

    const session = verifySessionToken(sessionToken);

    if (!session) {
      res.status(401).json({ error: "Session invalide" });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "Mot de passe actuel et nouveau mot de passe requis" });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: "Le nouveau mot de passe doit contenir au moins 6 caractères" });
      return;
    }

    try {
      // Récupérer l'utilisateur
      const user = await db.getUserById(session.userId);

      if (!user || !user.password) {
        res.status(404).json({ error: "Utilisateur non trouvé" });
        return;
      }

      // Vérifier le mot de passe actuel
      const isPasswordValid = await comparePassword(currentPassword, user.password);

      if (!isPasswordValid) {
        res.status(401).json({ error: "Mot de passe actuel incorrect" });
        return;
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = await hashPassword(newPassword);

      // Mettre à jour le mot de passe
      await db.updateUserPassword(user.id, hashedPassword);

      res.json({ success: true, message: "Mot de passe modifié avec succès" });
    } catch (error) {
      console.error("[SimpleAuth] Change password failed:", error);
      res.status(500).json({ error: "Erreur lors du changement de mot de passe" });
    }
  });
}
