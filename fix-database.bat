@echo off
echo ========================================
echo Database Migration Tool for PropGroup
echo ========================================
echo.

cd /d "%~dp0"

echo This script will fix missing database columns.
echo.
echo Choose an option:
echo 1. Run custom migration (adds missing columns)
echo 2. Use Prisma db push (recreates entire schema)
echo 3. Both (migration first, then push)
echo.

set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto migration
if "%choice%"=="2" goto prisma
if "%choice%"=="3" goto both
goto invalid

:migration
echo.
echo Running custom migration...
echo --------------------------------
cd packages\db
node migrate.js
if %errorlevel% neq 0 (
    echo.
    echo Migration failed! Trying Prisma db push as fallback...
    goto prisma
)
echo.
echo ✅ Migration completed successfully!
goto end

:prisma
echo.
echo Running Prisma db push...
echo --------------------------------
cd packages\db
call npx prisma generate
call npx prisma db push --skip-generate
if %errorlevel% neq 0 (
    echo.
    echo ❌ Prisma db push failed!
    echo Please check your database connection.
    pause
    exit /b 1
)
echo.
echo ✅ Prisma db push completed successfully!
goto end

:both
echo.
echo Running both migration and Prisma db push...
echo --------------------------------
cd packages\db
echo.
echo Step 1: Running custom migration...
node migrate.js
echo.
echo Step 2: Running Prisma db push...
call npx prisma generate
call npx prisma db push --skip-generate
echo.
echo ✅ Both operations completed!
goto end

:invalid
echo.
echo Invalid choice! Please run the script again.
pause
exit /b 1

:end
echo.
echo ========================================
echo Database is now ready!
echo ========================================
echo.
echo Next steps:
echo 1. Run "npm run dev" to start the development server
echo 2. The application should now work without database errors
echo.
pause
