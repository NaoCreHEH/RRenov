import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerSimpleAuthRoutes, initializeAdminUser } from "./simpleAuth";
import { appRouter } from "../routers";
import { createContext } from "./contextSimple";
import { serveStatic, setupVite } from "./vite";
import mysql from "mysql2/promise";
import multer from "multer";
import path from "path"; // NOUVEAU
import { nanoid } from "nanoid"; // NOUVEAU

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cookieParser());

  // --- Upload Endpoint ---
  const uploadDir = path.join(process.cwd(), "client", "public", "uploads");
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = nanoid() + ext;
      cb(null, filename);
    },
  });
  const upload = multer({ storage: storage });

  app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    // Le chemin d'accès public est /uploads/nom_du_fichier
    const publicPath = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: publicPath });
  });
  // Simple Auth routes
  registerSimpleAuthRoutes(app);
  // Initialize admin user
  await initializeAdminUser();
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  // --- DIAGNOSTIC DB (temporaire) ---


app.get("/__db", async (_req, res) => {
  try {
    const url = process.env.DATABASE_URL!;
    // Masque le mot de passe dans les logs
    console.log("DATABASE_URL:", url.replace(/:(.*?)@/, ":****@"));

    const conn = await mysql.createConnection(url);
    const [rows] = await conn.query("SELECT NOW() AS now");
    await conn.end();

    res.json({ ok: true, rows });
  } catch (e: any) {
    console.error("DB error:", e?.message || e);
    res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
});
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
