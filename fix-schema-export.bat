@echo off
echo Fixing schema export issue...
echo.

cd /d "%~dp0\.."

echo Step 1: Cleaning old builds...
rmdir /s /q packages\config\dist 2>nul
rmdir /s /q packages\supabase\dist 2>nul
rmdir /s /q packages\ui\dist 2>nul
rmdir /s /q apps\web\.next 2>nul
echo Cleaned old builds
echo.

echo Step 2: Installing dependencies (if needed)...
cd packages\config
if not exist node_modules (
    echo Installing config dependencies...
    call npm install
)
cd ..\..
echo.

echo Step 3: Building config package...
cd packages\config
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build config package
    pause
    exit /b 1
)
echo Built config package successfully
cd ..\..
echo.

echo Step 4: Building supabase package...
cd packages\supabase
if not exist node_modules (
    echo Installing supabase dependencies...
    call npm install
)
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build supabase package
    pause
    exit /b 1
)
echo Built supabase package successfully
cd ..\..
echo.

echo Step 5: Building UI package...
cd packages\ui
if not exist node_modules (
    echo Installing UI dependencies...
    call npm install
)
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build UI package
    pause
    exit /b 1
)
echo Built UI package successfully
cd ..\..
echo.

echo ====================================
echo FIX COMPLETE!
echo ====================================
echo.
echo The schema export issue has been fixed.
echo.
echo Next steps:
echo 1. Run "npm run dev" to start the development server
echo 2. The InvestmentMatchmaker component should now work correctly
echo.
pause
