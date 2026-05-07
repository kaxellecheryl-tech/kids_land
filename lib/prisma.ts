import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PrismaClientCtor = PrismaClient as new (opts: any) => PrismaClient;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClientCtor({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
