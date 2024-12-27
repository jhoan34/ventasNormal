import { PrismaClient } from "@prisma/client";

// Evitar múltiples instancias de PrismaClient
const prismaGlobal = global as typeof global & { prisma?: PrismaClient };

// Si no existe una instancia, creamos una
export const db = prismaGlobal.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    prismaGlobal.prisma = db;
}
