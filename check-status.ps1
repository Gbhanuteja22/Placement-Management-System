Write-Host "Checking PlacementPro Application Status..." -ForegroundColor Green
Write-Host "Checking API Server (http://localhost:3008)..." -ForegroundColor Cyan
try {
    $healthCheck = Invoke-RestMethod -Uri "http://localhost:3008/health" -Method GET -TimeoutSec 5
    Write-Host "  API Server: RUNNING" -ForegroundColor Green
    Write-Host "     Status: $($healthCheck.status)" -ForegroundColor White
    Write-Host "     Service: $($healthCheck.service)" -ForegroundColor White
}
catch {
    Write-Host "  API Server: NOT RESPONDING" -ForegroundColor Red
    Write-Host "     Error: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host "Checking Database Connection..." -ForegroundColor Cyan
try {
    $dbStatus = Invoke-RestMethod -Uri "http://localhost:3008/db-test/status" -Method GET -TimeoutSec 5
    Write-Host "  Database: CONNECTED" -ForegroundColor Green
    Write-Host "     Status: $($dbStatus.mongodb.status)" -ForegroundColor White
    Write-Host "     Host: $($dbStatus.mongodb.host)" -ForegroundColor White
    Write-Host "     Database: $($dbStatus.mongodb.database)" -ForegroundColor White
}
catch {
    Write-Host "  Database: CONNECTION FAILED" -ForegroundColor Red
    Write-Host "     Error: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host "Checking Frontend (http://localhost:3000)..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "  Frontend: RUNNING" -ForegroundColor Green
        Write-Host "     Status Code: $($response.StatusCode)" -ForegroundColor White
    } else {
        Write-Host "  Frontend: UNUSUAL RESPONSE" -ForegroundColor Yellow
        Write-Host "     Status Code: $($response.StatusCode)" -ForegroundColor White
    }
}
catch {
    Write-Host "  Frontend: NOT RESPONDING" -ForegroundColor Red
    Write-Host "     Error: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host "Checking Node.js Processes..." -ForegroundColor Cyan
$nodeProcesses = Get-Process | Where-Object {$_.ProcessName -eq "node"}
if ($nodeProcesses.Count -gt 0) {
    Write-Host "  Node.js Processes: $($nodeProcesses.Count) running" -ForegroundColor Green
    foreach ($process in $nodeProcesses) {
        Write-Host "     PID: $($process.Id) | CPU: $($process.CPU)" -ForegroundColor White
    }
} else {
    Write-Host "  Node.js Processes: NONE RUNNING" -ForegroundColor Red
}
Write-Host "Status Check Complete!" -ForegroundColor Green
$apiRunning = $false
$dbConnected = $false
$frontendRunning = $false
try {
    Invoke-RestMethod -Uri "http://localhost:3008/health" -Method GET -TimeoutSec 3 | Out-Null
    $apiRunning = $true
} catch {}
try {
    $dbCheck = Invoke-RestMethod -Uri "http://localhost:3008/db-test/status" -Method GET -TimeoutSec 3
    if ($dbCheck.mongodb.status -eq "connected") { $dbConnected = $true }
} catch {}
try {
    $frontendCheck = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 3 -UseBasicParsing
    if ($frontendCheck.StatusCode -eq 200) { $frontendRunning = $true }
} catch {}
Write-Host "SUMMARY:" -ForegroundColor White
Write-Host "   API Server: $(if($apiRunning){'READY'}else{'DOWN'})" -ForegroundColor $(if($apiRunning){'Green'}else{'Red'})
Write-Host "   Database: $(if($dbConnected){'CONNECTED'}else{'DISCONNECTED'})" -ForegroundColor $(if($dbConnected){'Green'}else{'Red'})
Write-Host "   Frontend: $(if($frontendRunning){'READY'}else{'DOWN'})" -ForegroundColor $(if($frontendRunning){'Green'}else{'Red'})
if ($apiRunning -and $dbConnected -and $frontendRunning) {
    Write-Host "ALL SYSTEMS OPERATIONAL!" -ForegroundColor Green
    Write-Host "Application ready at: http://localhost:3000" -ForegroundColor Cyan
} else {
    Write-Host "SOME SERVICES ARE DOWN" -ForegroundColor Yellow
    Write-Host "Try running: .\start.ps1 or .\start.bat" -ForegroundColor White
}
