// Since we're using Supabase, Prisma is optional
// This file is kept for compatibility but may not be used in production

let prisma: any = null;

try {
  const { PrismaClient } = require('@propgroup/db');
  
  const globalForPrisma = globalThis as unknown as {
    prisma: any | undefined
  }

  prisma = globalForPrisma.prisma ?? new PrismaClient()

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
} catch (error) {
  console.warn('Prisma client not available, using Supabase instead');
  // Export a mock prisma client for compatibility
  prisma = {
    // Add mock methods if needed
  };
}

export { prisma };
