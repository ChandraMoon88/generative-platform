# Test the registration and login APIs

Write-Host "Testing Registration API..." -ForegroundColor Cyan

# Register a new user
$registerData = @{
    name = "Test User"
    email = "chandrashekarkuncham810@gmail.com"
    password = "TestPass123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "https://generative-platform.vercel.app/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $registerData `
    -UseBasicParsing

Write-Host "Registration Response:" -ForegroundColor Green
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10

Write-Host "`nTesting Login API..." -ForegroundColor Cyan

# Test login
$loginData = @{
    email = "chandrashekarkuncham810@gmail.com"
    password = "TestPass123"
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri "https://generative-platform.vercel.app/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginData `
    -UseBasicParsing

Write-Host "Login Response:" -ForegroundColor Green
$loginResponse.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
