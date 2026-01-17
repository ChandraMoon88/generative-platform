# Auto-Commit Script for Generative Platform
# This script watches for file changes and automatically commits and pushes to GitHub
# Run: .\auto-commit.ps1  (keep this terminal open)

param(
    [string]$WatchPath = "c:\Users\chand\Downloads\generative platform",
    [int]$CheckInterval = 10
)

# Change to the watch directory
Set-Location $WatchPath

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Generative Platform Auto-Commit" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Watching: $WatchPath" -ForegroundColor Green
Write-Host "Check Interval: $CheckInterval seconds" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop watching..." -ForegroundColor Yellow
Write-Host ""

# Polling-based approach (more reliable than FileSystemWatcher)
$lastHash = ""

while ($true) {
    try {
        Set-Location $WatchPath
        
        # Get current git status
        $status = git status --porcelain 2>$null
        
        # Filter out parent folder files (only include files in current project)
        $projectStatus = $status | Where-Object { 
            $_ -and -not $_.Contains("../") -and -not $_.Contains("..\\")
        }
        
        $currentHash = if ($projectStatus) { ($projectStatus | Out-String).GetHashCode() } else { "" }
        
        # Check if there are changes and they're different from last check
        if ($projectStatus -and $currentHash -ne $lastHash) {
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            $changedFiles = ($projectStatus | Measure-Object).Count
            
            Write-Host ""
            Write-Host "[$timestamp] Detected $changedFiles changed file(s)" -ForegroundColor Yellow
            
            # Show changed files
            $projectStatus | ForEach-Object {
                Write-Host "  $_" -ForegroundColor Gray
            }
            
            # Stage only project files (use . instead of -A to avoid parent folder)
            git add . 2>$null
            
            # Generate commit message
            $fileList = ($projectStatus | ForEach-Object { $_.Substring(3).Trim() }) -join ", "
            if ($fileList.Length -gt 80) {
                $fileList = $fileList.Substring(0, 77) + "..."
            }
            $commitMessage = "Auto-commit [$changedFiles files]: $fileList"
            
            # Commit
            $commitResult = git commit -m "$commitMessage" 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "[$timestamp] Committed successfully" -ForegroundColor Green
                
                # Push to remote
                Write-Host "[$timestamp] Pushing to GitHub..." -ForegroundColor Cyan
                
                # Try main branch first
                $pushResult = git push origin main 2>&1
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "[$timestamp] Successfully pushed to GitHub!" -ForegroundColor Green
                    Write-Host ""
                } else {
                    # Try master branch if main fails
                    $pushResult = git push origin master 2>&1
                    if ($LASTEXITCODE -eq 0) {
                        Write-Host "[$timestamp] Successfully pushed to GitHub (master)!" -ForegroundColor Green
                        Write-Host ""
                    } else {
                        Write-Host "[$timestamp] Push failed: $pushResult" -ForegroundColor Red
                        Write-Host "[$timestamp] Will retry on next change." -ForegroundColor Yellow
                    }
                }
                
                $lastHash = ""  # Reset to allow detecting new changes
            } else {
                if ($commitResult -match "nothing to commit") {
                    Write-Host "[$timestamp] Already up to date" -ForegroundColor Gray
                }
                $lastHash = $currentHash
            }
        }
    } catch {
        Write-Host "[Error] $_" -ForegroundColor Red
    }
    
    # Wait before next check
    Start-Sleep -Seconds $CheckInterval
}
