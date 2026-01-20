# Prepare Repository for Public GitHub Release
# This script helps you verify what will be public vs private

Write-Host "🔍 EcoSphere - Public Release Checker" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (!(Test-Path "frontend") -or !(Test-Path "backend")) {
    Write-Host "❌ Error: Run this from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Checking .gitignore configuration..." -ForegroundColor Yellow
Write-Host ""

# Files that MUST be ignored
$mustIgnore = @(
    "admin",
    "plan.txt",
    "ADMIN_SECURITY_COMPLETE.md",
    "ECOSPHERE_IMPLEMENTATION_CHECKLIST.txt",
    "LEVEL_14_15_COMPLETE.md"
)

$gitignoreContent = Get-Content ".gitignore" -Raw

$allGood = $true
foreach ($item in $mustIgnore) {
    if ($gitignoreContent -match [regex]::Escape($item)) {
        Write-Host "✅ $item - Protected" -ForegroundColor Green
    } else {
        Write-Host "❌ $item - NOT in .gitignore!" -ForegroundColor Red
        $allGood = $false
    }
}

Write-Host ""
Write-Host "📁 Files that will be PUBLIC on GitHub:" -ForegroundColor Yellow
Write-Host ""

# Show what will be committed
$publicFiles = @(
    "frontend/",
    "backend/",
    "README_USER.md",
    ".gitignore",
    "vercel_frontend.json",
    "LICENSE"
)

foreach ($file in $publicFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ $file (not found)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🔒 Files that will be PRIVATE (local only):" -ForegroundColor Yellow
Write-Host ""

$privateFiles = @(
    "admin/",
    "plan.txt",
    "ADMIN_SECURITY_COMPLETE.md",
    "ECOSPHERE_IMPLEMENTATION_CHECKLIST.txt",
    "LEVEL_14_15_COMPLETE.md",
    "VERCEL_DEPLOY_PUBLIC.md",
    "start-all.ps1",
    "stop-all.ps1"
)

foreach ($file in $privateFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "✅ Configuration looks good!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Copy README_USER.md to README.md:" -ForegroundColor White
    Write-Host "   Copy-Item README_USER.md README.md -Force" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Test what will be committed:" -ForegroundColor White
    Write-Host "   git status" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Commit public files:" -ForegroundColor White
    Write-Host "   git add ." -ForegroundColor Gray
    Write-Host "   git commit -m 'Public release: EcoSphere game'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. Push to GitHub:" -ForegroundColor White
    Write-Host "   git push origin main" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "❌ Issues found! Fix .gitignore before pushing to GitHub" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
