import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { isProduction, serverEnv } from "@/lib/env";
import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const createPrismaClient = () => {
  const adapter = new PrismaPg({ connectionString: serverEnv.databaseUrl });

  return new PrismaClient({
    adapter,
    log: isProduction ? ["error"] : ["warn", "error"],
  });
};

const getPrismaClient = (): PrismaClient => {
  globalForPrisma.prisma ??= createPrismaClient();

  return globalForPrisma.prisma;
};

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getPrismaClient();
    const value = Reflect.get(client, property);

    return typeof value === "function" ? value.bind(client) : value;
  },
});
