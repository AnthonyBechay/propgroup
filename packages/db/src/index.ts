import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Export both named and default exports
export { PrismaClient }
export default prisma

// Re-export all types and enums from Prisma client
export type {
  User,
  Developer,
  LocationGuide,
  Property,
  PropertyInvestmentData,
  FavoriteProperty,
  PropertyInquiry,
  UserOwnedProperty,
  AdminAuditLog,
} from '@prisma/client'

export {
  Country,
  PropertyStatus,
  InvestmentGoal,
  Role,
} from '@prisma/client'
