import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { COOKIE_NAME } from "@shared/const";
import { verifySessionToken } from "./simpleAuth";
import * as db from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Récupérer le token de session depuis les cookies
    const sessionToken = opts.req.cookies[COOKIE_NAME];

    if (sessionToken) {
      // Vérifier et décoder le token
      const session = verifySessionToken(sessionToken);

      if (session) {
        // Récupérer l'utilisateur depuis la base de données
        const dbUser = await db.getUserById(session.userId);
        user = dbUser || null;
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    console.log("[Auth] Missing session cookie");
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
