import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const databaseUrl = process.env.DATABASE_URL || ''

function createPrismaClient(): PrismaClient {
  if (!databaseUrl) {
    console.warn('⚠️ DATABASE_URL not set — database features will not work. Set it in Vercel Environment Variables.')
    // Return a minimal stub that won't crash the build
    // Real queries will fail gracefully via try/catch in catalog.ts
    return new PrismaClient()
  }
  return new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
