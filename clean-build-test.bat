@echo off
echo ==============================
echo PropGroup Clean Build Test
echo ==============================
echo.
echo This ensures a completely clean build
echo.

echo Step 1: Cleaning all build artifacts...
if exist "apps\web\.next" (
    echo   Removing .next folder...
    rmdir /s /q "apps\web\.next" 2>nul
)
if exist "packages\config\dist" (
    echo   Removing config/dist...
    rmdir /s /q "packages\config\dist" 2>nul
)
if exist "packages\db\dist" (
    echo   Removing db/dist...
    rmdir /s /q "packages\db\dist" 2>nul
)
if exist "packages\supabase\dist" (
    echo   Removing supabase/dist...
    rmdir /s /q "packages\supabase\dist" 2>nul
)
if exist "packages\ui\dist" (
    echo   Removing ui/dist...
    rmdir /s /q "packages\ui\dist" 2>nul
)

echo.
echo Step 2: Installing dependencies...
call npm install --silent

echo.
echo Step 3: Running Vercel build script...
call npm run vercel-build

echo.
echo ==============================
if %errorlevel% equ 0 (
    echo BUILD SUCCESSFUL!
    echo ==============================
    echo.
    echo Your project is ready to deploy to Vercel!
    echo.
    echo Next steps:
    echo   1. Commit your changes: git add . ^&^& git commit -m "Fix: deployment issues"
    echo   2. Push to repository: git push
    echo   3. Deploy to Vercel: vercel --prod
    echo.
    echo Or to test locally:
    echo   cd apps\web
    echo   npm start
) else (
    echo BUILD FAILED!
    echo ==============================
    echo.
    echo Check the errors above and fix them before deploying.
)
echo.
pause
