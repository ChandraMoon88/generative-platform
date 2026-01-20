# Add Neon Database Environment Variables to Vercel
# Run this script to configure your Vercel deployment with Neon database credentials

Write-Host "Adding environment variables to Vercel project..." -ForegroundColor Cyan

# Get the current directory
$frontendPath = "c:\Users\chand\Downloads\generative platform\frontend"
Set-Location $frontendPath

# Database URL (pooled connection)
vercel env add POSTGRES_URL production --sensitive --force
Write-Host "Paste your POSTGRES_URL (pooled): postgresql://neondb_owner:npg_Jt4RrbD8BLYk@ep-hidden-bread-ahtfp51u-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Database URL (direct connection)
vercel env add DATABASE_URL production --sensitive --force
Write-Host "Paste your DATABASE_URL: postgresql://neondb_owner:npg_Jt4RrbD8BLYk@ep-hidden-bread-ahtfp51u-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

Write-Host "`nEnvironment variables added! Redeploy to apply changes:" -ForegroundColor Green
Write-Host "vercel --prod" -ForegroundColor Yellow
