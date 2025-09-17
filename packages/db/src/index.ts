// Supabase-first approach - Prisma is optional
// This package provides compatibility layer for legacy Prisma code

let prisma: any = null;

// Export PrismaClient class for compatibility
class PrismaClient {
  constructor(options: any = {}) {
    console.log('Using fallback PrismaClient - Supabase is the primary database');
  }
  
  $connect() { 
    return Promise.resolve(); 
  }
  
  $disconnect() { 
    return Promise.resolve(); 
  }
  
  // Add common Prisma methods as stubs
  user = {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({})
  };
  
  property = {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({})
  };
}

// Create a singleton instance with proper typing
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
};

prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Export both named and default exports
export { prisma, PrismaClient };
export default prisma;
