@echo off
echo Building PropGroup database package...

cd packages\db

echo Generating Prisma client...
call npm run db:generate

echo Building TypeScript...
call npm run build

echo Database package build complete!
cd ..\..\
