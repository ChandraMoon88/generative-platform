# Stop All Generative Platform Servers

Write-Host "🛑 Stopping all Generative Platform servers..." -ForegroundColor Red
Write-Host ""

$processes = Get-Process | Where-Object { 
    ($_.ProcessName -match "node" -or $_.ProcessName -match "tsx") -and 
    $_.Path -like "*generative platform*"
}

if ($processes) {
    Write-Host "Found $($processes.Count) processes to stop..." -ForegroundColor Yellow
    $processes | ForEach-Object {
        Write-Host "  Stopping PID $($_.Id) - $($_.ProcessName)" -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force
    }
    Write-Host ""
    Write-Host "✅ All servers stopped!" -ForegroundColor Green
} else {
    Write-Host "⚠️  No running servers found." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
