@echo off
echo ====================================
echo QUICK DATABASE FIX
echo ====================================
echo.

cd /d "%~dp0"
cd packages\db

echo Fixing database...

REM Try to fix profiles table first
node fix-profiles-table.js 2>nul

REM Add missing columns
node migrate.js 2>nul

REM Generate Prisma client
call npx prisma generate

REM If all else fails, force push
call npx prisma db push --accept-data-loss 2>nul

echo.
echo ✅ Done! Your database should be working now.
echo.
echo Run "npm run dev" to start the application.
echo.
pause
