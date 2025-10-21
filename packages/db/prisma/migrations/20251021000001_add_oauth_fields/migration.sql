-- AlterTable
-- Add password column for JWT auth (if it doesn't exist)
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password" TEXT;

-- Add OAuth and profile fields to User table
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "googleId" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "provider" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatar" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "users_googleId_key" ON "users"("googleId");

-- Update existing users to have 'local' as default provider (only if they have a password)
UPDATE "users" SET "provider" = 'local' WHERE "provider" IS NULL AND "password" IS NOT NULL;
