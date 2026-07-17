import path from "node:path";
import { readFileSync } from "node:fs";

/**
 * Loads DATABASE_URL / DIRECT_URL from the project .env so integration tests
 * run against the configured Supabase Postgres database.
 */
function loadProjectEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  try {
    const content = readFileSync(envPath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // Tests that need a DB will fail with a clear Prisma error instead.
  }
}

loadProjectEnv();

export async function disconnectDb() {
  try {
    const { prisma } = await import("../src/lib/db");
    await prisma.$disconnect();
  } catch (err) {
    console.warn("Error disconnecting Prisma client:", err);
  }
}
