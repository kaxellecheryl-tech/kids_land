import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PrismaClientCtor = PrismaClient as new (opts: any) => PrismaClient;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function makePrisma() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    // Supabase requires SSL; rejectUnauthorized: false accepts the self-signed cert
    ssl: { rejectUnauthorized: false },
    // Generous timeouts for cold-start / serverless environments
    connectionTimeoutMillis: 15_000,
    idleTimeoutMillis: 30_000,
    // Keep pool small to stay within Supabase free-tier connection limits
    max: 5,
  });

  return new PrismaClientCtor({
    adapter: new PrismaPg(pool),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? makePrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
