@echo off
echo ==============================
echo Local Build Test
echo ==============================
echo.

echo Cleaning old build...
cd apps\web
if exist ".next" rmdir /s /q .next
cd ..\..

echo.
echo Building packages...
call npm run build:packages

echo.
echo Building Next.js app...
cd apps\web
call npm run build

echo.
echo ==============================
if %errorlevel% equ 0 (
    echo BUILD SUCCESS!
    echo.
    echo You can now start the production server:
    echo   npm start
) else (
    echo BUILD FAILED!
    echo Check the errors above
)
echo ==============================
pause
