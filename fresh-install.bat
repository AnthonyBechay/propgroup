@echo off
echo ========================================
echo PropGroup - Fresh Installation
echo ========================================
echo.

echo Step 1: Cleaning old files...
echo ------------------------------
if exist node_modules rd /s /q node_modules 2>nul
if exist package-lock.json del package-lock.json 2>nul
if exist apps\web\node_modules rd /s /q apps\web\node_modules 2>nul
if exist apps\web\.next rd /s /q apps\web\.next 2>nul
if exist packages\supabase\dist rd /s /q packages\supabase\dist 2>nul
if exist packages\ui\dist rd /s /q packages\ui\dist 2>nul
if exist packages\config\dist rd /s /q packages\config\dist 2>nul
echo Done!
echo.

echo Step 2: Installing dependencies...
echo ----------------------------------
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo Failed to install dependencies
    pause
    exit /b 1
)
echo Done!
echo.

echo Step 3: Starting development server...
echo --------------------------------------
echo.
echo NOTE: Package build errors can be ignored!
echo The development server will start anyway.
echo.

cd apps\web
call npm run dev

pause
