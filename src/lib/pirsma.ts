import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Evita crear multiples instancias del cliente de la base de datos
// en modo desarrollo y lo que hace es guardar la instancia en el objeto "global" de node
// Es el patron de diseño "Singleton"