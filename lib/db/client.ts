import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const createClient = () =>
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  }).$extends(withAccelerate());

export type PrismaAccelerateClient = ReturnType<typeof createClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaAccelerateClient | undefined;
};

/**
 * Cloudflare Workers / Edge compatible Prisma client (lazy-init).
 *
 * Next.js builds may evaluate route modules without your runtime env vars,
 * so we intentionally defer Prisma initialization until first use.
 *
 * IMPORTANT:
 * - Set DATABASE_URL to a Prisma Accelerate/Data Proxy URL (starts with `prisma://`).
 * - Set DIRECT_URL to your actual Postgres connection string (used for migrations / db push).
 */
export function getPrisma(): PrismaAccelerateClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  // Avoid hard-crashing during `next build` when env vars are not available.
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = createClient();
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}
