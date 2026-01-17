# Quick Deployment Script
# Run this to deploy to Vercel with all security features

Write-Host "`n🚀 Starting Vercel Deployment Process...`n" -ForegroundColor Cyan

# Check if Vercel CLI is installed
Write-Host "Checking Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (!$vercelInstalled) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed`n" -ForegroundColor Green
} else {
    Write-Host "✅ Vercel CLI found`n" -ForegroundColor Green
}

# Check if logged in
Write-Host "Checking Vercel login..." -ForegroundColor Yellow
$loginCheck = vercel whoami 2>&1
if ($loginCheck -match "Error") {
    Write-Host "❌ Not logged in. Please login..." -ForegroundColor Red
    vercel login
} else {
    Write-Host "✅ Logged in as: $loginCheck`n" -ForegroundColor Green
}

# Generate secrets
Write-Host "Generating secure secrets..." -ForegroundColor Yellow
$jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
$webhookSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
$adminSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

Write-Host "✅ Secrets generated`n" -ForegroundColor Green

# Save secrets locally
$secretsFile = ".env.local.secrets"
@"
# Generated Secrets - KEEP THESE SAFE!
JWT_SECRET=$jwtSecret
WEBHOOK_SECRET=$webhookSecret
ADMIN_SECRET=$adminSecret
"@ | Out-File -FilePath $secretsFile -Encoding UTF8

Write-Host "✅ Secrets saved to: $secretsFile`n" -ForegroundColor Green

# Deploy
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
vercel

Write-Host "`n📝 Setting environment variables..." -ForegroundColor Yellow

# Set environment variables
Write-Host "Setting JWT_SECRET..." -ForegroundColor Gray
echo $jwtSecret | vercel env add JWT_SECRET production

Write-Host "Setting WEBHOOK_SECRET..." -ForegroundColor Gray
echo $webhookSecret | vercel env add WEBHOOK_SECRET production

Write-Host "Setting ADMIN_SECRET..." -ForegroundColor Gray
echo $adminSecret | vercel env add ADMIN_SECRET production

Write-Host "Setting NODE_ENV..." -ForegroundColor Gray
echo "production" | vercel env add NODE_ENV production

Write-Host "`n✅ Environment variables set`n" -ForegroundColor Green

# Final deployment
Write-Host "🚀 Final production deployment..." -ForegroundColor Cyan
vercel --prod

Write-Host "`n✅ DEPLOYMENT COMPLETE!`n" -ForegroundColor Green

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "          NEXT STEPS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

Write-Host "1️⃣  Start Local Sync Service:" -ForegroundColor Yellow
Write-Host "   `$env:WEBHOOK_SECRET='$webhookSecret'" -ForegroundColor Gray
Write-Host "   node local-sync-service.js`n" -ForegroundColor Gray

Write-Host "2️⃣  Expose with Cloudflare Tunnel (Free Forever):" -ForegroundColor Yellow
Write-Host "   # Install: winget install Cloudflare.cloudflared" -ForegroundColor Gray
Write-Host "   cloudflared tunnel --url http://localhost:4000`n" -ForegroundColor Gray

Write-Host "3️⃣  Set webhook URL in Vercel:" -ForegroundColor Yellow
Write-Host "   vercel env add ADMIN_WEBHOOK_URL production" -ForegroundColor Gray
Write-Host "   Enter: https://your-tunnel.trycloudflare.com/webhook/apps`n" -ForegroundColor Gray

Write-Host "4️⃣  Redeploy:" -ForegroundColor Yellow
Write-Host "   vercel --prod`n" -ForegroundColor Gray

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

Write-Host "📋 Your secrets are saved in: $secretsFile" -ForegroundColor Green
Write-Host "🔐 Keep this file safe and never commit it!`n" -ForegroundColor Red

Write-Host "🎉 Your app is now live on Vercel!" -ForegroundColor Green
Write-Host "   Check your deployment URL in the output above`n" -ForegroundColor Gray
