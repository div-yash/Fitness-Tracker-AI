Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Starting Fitness Tracker AI Services   " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Start Python Flask ML Service
Write-Host "[1/3] Starting Python ML Microservice on port 5000..." -ForegroundColor Yellow
$mlProcess = Start-Process python -ArgumentList "main.py" -WorkingDirectory "$PSScriptRoot\Medicine-Recommendation-and-Disease-Prediction-using-Random-Forest" -PassThru

# 2. Start .NET Core Backend API
Write-Host "[2/3] Starting .NET Core Backend API on port 8080..." -ForegroundColor Yellow
$backendProcess = Start-Process dotnet -ArgumentList "run" -WorkingDirectory "$PSScriptRoot\FitnessTracker_Latest\dotnetapp" -PassThru

# 3. Start Angular Frontend Dev Server
Write-Host "[3/3] Starting Angular Frontend on port 8081..." -ForegroundColor Yellow
$frontendProcess = Start-Process cmd.exe -ArgumentList "/c npm start" -WorkingDirectory "$PSScriptRoot\FitnessTracker_Latest\angularapp" -PassThru

Start-Sleep -Seconds 3

Write-Host "`n==========================================" -ForegroundColor Green
Write-Host " All 3 Services Have Been Launched!       " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  * Frontend UI:     http://localhost:8081" -ForegroundColor Cyan
Write-Host "  * Swagger API:     http://localhost:8080/swagger" -ForegroundColor Cyan
Write-Host "  * ML Diagnostics:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "`nRun .\stop_local.ps1 to shut down all services." -ForegroundColor Gray
