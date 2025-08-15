Write-Host "Starting PlacementPro Application..." -ForegroundColor Green
if (!(Test-Path "apps\api\simple-server.js")) {
    Write-Host "Error: Please run this script from the PlacementManagementSystem root directory" -ForegroundColor Red
    exit 1
}
Write-Host "Stopping existing node processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "Starting API server on port 3008..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\apps\api'; Write-Host 'API Server Starting...' -ForegroundColor Green; node simple-server.js" -WindowStyle Normal
Write-Host "Waiting for API server to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
try {
    $healthCheck = Invoke-RestMethod -Uri "http://localhost:3008/health" -Method GET -TimeoutSec 5
    Write-Host "API server is running: $($healthCheck.status)" -ForegroundColor Green
}
catch {
    Write-Host "API server may still be starting..." -ForegroundColor Yellow
}
Write-Host "Starting frontend on port 3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\apps\web'; Write-Host 'Frontend Starting...' -ForegroundColor Green; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 3
Write-Host "PlacementPro is starting up!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "API: http://localhost:3008" -ForegroundColor Cyan
Write-Host "Please wait 10-15 seconds for both services to fully initialize..." -ForegroundColor Yellow
Write-Host "The browser should open automatically, or visit http://localhost:3000" -ForegroundColor White
Start-Sleep -Seconds 8
Start-Process "http://localhost:3000"
Write-Host "Startup complete! Check the opened terminal windows for logs." -ForegroundColor Green
