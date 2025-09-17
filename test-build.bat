@echo off
echo ==============================
echo PropGroup Vercel Build Test
echo ==============================
echo.
echo This tests the exact build process that runs on Vercel
echo.

echo Cleaning build artifacts...
if exist "apps\web\.next" rmdir /s /q "apps\web\.next"
if exist "packages\config\dist" rmdir /s /q "packages\config\dist"
if exist "packages\db\dist" rmdir /s /q "packages\db\dist"
if exist "packages\supabase\dist" rmdir /s /q "packages\supabase\dist"
if exist "packages\ui\dist" rmdir /s /q "packages\ui\dist"

echo.
echo Installing dependencies...
call npm install

echo.
echo Running Vercel build script...
call npm run vercel-build

echo.
echo ==============================
if %errorlevel% equ 0 (
    echo BUILD SUCCESSFUL!
    echo ==============================
    echo.
    echo To start the production server locally:
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
