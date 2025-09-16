// Since we're using Supabase, Prisma is optional
// This package provides a fallback Prisma client for compatibility

let prisma: any = null;

try {
  // Try to import PrismaClient if available
  const { PrismaClient } = require('./generated');
  
  const globalForPrisma = globalThis as unknown as {
    prisma: any | undefined
  }

  prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  })

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
} catch (error) {
  console.warn('Prisma generated client not available, using Supabase instead');
  // Export a mock prisma client for compatibility
  prisma = {
    // Add mock methods if needed
  };
}

export { prisma };

// Try to export from generated, but don't fail if it doesn't exist
try {
  module.exports = { ...module.exports, ...require('./generated') };
} catch (error) {
  // Ignore if generated doesn't exist
}
