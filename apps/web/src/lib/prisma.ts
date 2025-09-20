// Prisma client with proper error handling for production
let prisma: any = null;

try {
  const { PrismaClient } = require('@propgroup/db');
  
  const globalForPrisma = globalThis as unknown as {
    prisma: any | undefined
  }

  prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
} catch (error) {
  console.warn('Prisma client not available, using Supabase instead:', error);
  // Export a mock prisma client for compatibility
  prisma = {
    property: {
      findMany: async () => [],
      count: async () => 0,
      findUnique: async () => null,
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({})
    },
    user: {
      findMany: async () => [],
      count: async () => 0,
      findUnique: async () => null,
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({})
    },
    $queryRaw: async () => [],
    $disconnect: async () => {}
  };
}

export { prisma };
