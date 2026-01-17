# Generative Platform - Startup Script
# Run all 3 servers in separate windows

Write-Host "🚀 Starting Generative Platform..." -ForegroundColor Green
Write-Host ""

# Start Backend API
Write-Host "1️⃣  Starting Backend API (Port 3001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\chand\Downloads\generative platform\backend'; npm run dev"
Start-Sleep -Seconds 2

# Start Client Server
Write-Host "2️⃣  Starting Client Server (Port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\chand\Downloads\generative platform\frontend'; npm run dev"
Start-Sleep -Seconds 2

# Start Admin Server
Write-Host "3️⃣  Starting Admin Server (Port 3002)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\chand\Downloads\generative platform\admin'; npm run dev"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "✅ All servers starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs:" -ForegroundColor Yellow
Write-Host "   Client (Users):  http://localhost:3000" -ForegroundColor White
Write-Host "   Admin (You):     http://localhost:3002" -ForegroundColor White
Write-Host "   Backend API:     http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Admin Login:" -ForegroundColor Yellow
Write-Host "   Email:    chandrashekarkuncham7@gmail.com" -ForegroundColor White
Write-Host "   Password: Moonstar@88Moon" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this window (servers will keep running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
