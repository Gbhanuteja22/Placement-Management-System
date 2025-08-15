@echo off
echo Starting PlacementPro Application...
if not exist "apps\api\simple-server.js" (
    echo Error: Please run this script from the PlacementManagementSystem root directory
    pause
    exit /b 1
)
echo Stopping existing node processes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo Starting API server on port 3008...
start "PlacementPro API" cmd /k "cd /d %cd%\apps\api && echo API Server Starting... && node simple-server.js"
echo Waiting for API server to initialize...
timeout /t 5 /nobreak >nul
echo Starting frontend on port 3000...
start "PlacementPro Frontend" cmd /k "cd /d %cd%\apps\web && echo Frontend Starting... && npm run dev"
timeout /t 3 /nobreak >nul
echo PlacementPro is starting up!
echo Frontend: http://localhost:3000
echo API: http://localhost:3008
echo Please wait 10-15 seconds for both services to fully initialize...
echo Visit http://localhost:3000 to access the application
timeout /t 8 /nobreak >nul
start http://localhost:3000
echo Startup complete! Check the opened command windows for logs.
pause
