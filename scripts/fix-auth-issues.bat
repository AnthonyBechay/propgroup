@echo off
REM Quick fix script for authentication and investment goal issues

echo Fixing authentication and investment goal issues...
echo.

REM Change to project root
cd /d "%~dp0\.."

echo Rebuilding config package with fixes...
cd packages\config
call npm run build

echo.
echo Rebuilding supabase package...
cd ..\supabase
call npm run build

echo.
echo Rebuilding web application...
cd ..\..\apps\web
call npm run build

echo.
echo Fix complete!
echo.
echo The following issues have been fixed:
echo   1. Invalid email address error during sign up/sign in
echo   2. Investment goal 'Expected number, received string' error
echo.
echo Changes made:
echo   - Added proper authentication schemas (authSchema, signupSchema)
echo   - Fixed password validation (was using email validation)
echo   - Added investmentMatchmakerSchema with correct types
echo   - Updated AuthModal component to use correct schemas
echo   - Updated InvestmentMatchmaker component to use correct schema
echo.
echo Next steps:
echo   1. Run 'npm run dev' to start the development server
echo   2. Test the sign up/sign in functionality
echo   3. Test the investment matchmaker form

pause
