@echo off
echo Cleaning up temporary build files...

rem Remove temporary build scripts created during fixes
if exist build-db.bat del build-db.bat
if exist build-db.sh del build-db.sh

echo Cleanup complete!
echo.
echo Essential files kept:
echo - PRODUCTION_MIGRATION_GUIDE.md (Important migration documentation)
echo - All source code changes have been applied
echo.
echo Next steps:
echo 1. Run "npm install" in root directory
echo 2. Run "npm run build:packages" to build all packages
echo 3. Deploy to Vercel following PRODUCTION_MIGRATION_GUIDE.md
