Write-Host "Shutting down local Fitness Tracker AI services..." -ForegroundColor Yellow

# Stop dotnetapp
$dotnetProcesses = Get-Process -Name "dotnet", "dotnetapp" -ErrorAction SilentlyContinue
foreach ($p in $dotnetProcesses) {
    try { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue } catch {}
}

# Stop Python
$pyProcesses = Get-Process -Name "python" -ErrorAction SilentlyContinue
foreach ($p in $pyProcesses) {
    try { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue } catch {}
}

# Stop ng serve / node processes running on port 8081
$portConns = Get-NetTCPConnection -LocalPort 8081, 8080, 5000 -ErrorAction SilentlyContinue
foreach ($c in $portConns) {
    try { Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue } catch {}
}

Write-Host "Services stopped successfully." -ForegroundColor Green
