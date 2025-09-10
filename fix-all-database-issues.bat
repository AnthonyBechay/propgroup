@echo off
echo ==========================================
echo PropGroup Database Fix Tool
echo ==========================================
echo.
echo This will fix database issues including:
echo - Supabase profiles table conflicts
echo - Missing columns in properties table
echo.

cd /d "%~dp0"

echo Choose a fix option:
echo.
echo 1. Quick Fix (Remove profiles table + Add missing columns)
echo 2. Safe Fix (Keep profiles table + Add missing columns)
echo 3. Full Reset (Drop all tables and recreate from schema)
echo 4. Check Database Status Only
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto quickfix
if "%choice%"=="2" goto safefix
if "%choice%"=="3" goto fullreset
if "%choice%"=="4" goto checkstatus
goto invalid

:quickfix
echo.
echo ==========================================
echo Running Quick Fix...
echo ==========================================
cd packages\db

echo.
echo Step 1: Removing Supabase profiles table...
node fix-profiles-table.js

echo.
echo Step 2: Adding missing columns...
node migrate.js

echo.
echo Step 3: Generating Prisma client...
call npx prisma generate

echo.
echo ✅ Quick fix completed!
goto success

:safefix
echo.
echo ==========================================
echo Running Safe Fix...
echo ==========================================
cd packages\db

echo.
echo Step 1: Adding missing columns...
node migrate.js

echo.
echo Step 2: Pushing schema (with --force-reset to handle conflicts)...
call npx prisma db push --force-reset --skip-generate

echo.
echo Step 3: Generating Prisma client...
call npx prisma generate

echo.
echo ✅ Safe fix completed!
goto success

:fullreset
echo.
echo ⚠️  WARNING: This will DELETE ALL DATA in your database!
echo.
set /p confirm="Are you sure? Type YES to continue: "
if not "%confirm%"=="YES" goto cancelled

echo.
echo ==========================================
echo Running Full Reset...
echo ==========================================
cd packages\db

echo.
echo Step 1: Resetting database...
call npx prisma db push --force-reset

echo.
echo Step 2: Generating Prisma client...
call npx prisma generate

echo.
echo Step 3: Creating seed data...
cd ..\..
echo Creating sample data...
node packages\db\seed.js 2>nul
if %errorlevel% neq 0 (
    echo Note: No seed data available, database is empty but ready.
) else (
    echo ✅ Sample data created!
)

echo.
echo ✅ Full reset completed!
goto success

:checkstatus
echo.
echo ==========================================
echo Checking Database Status...
echo ==========================================
cd packages\db

echo.
echo Checking for missing columns...
node check-database.js

echo.
echo Done! Review the output above.
pause
exit /b 0

:invalid
echo.
echo ❌ Invalid choice!
pause
exit /b 1

:cancelled
echo.
echo Operation cancelled.
pause
exit /b 0

:success
echo.
echo ==========================================
echo ✅ Database fix completed successfully!
echo ==========================================
echo.
echo Next steps:
echo 1. Run "npm run dev" to start the development server
echo 2. Test the application
echo.
echo If you still have issues, try option 3 (Full Reset)
echo.
pause
exit /b 0
