# Auto-Commit Script for Generative Platform
# This script watches for file changes and automatically commits and pushes to GitHub

param(
    [string]$WatchPath = (Get-Location).Path,
    [int]$DebounceSeconds = 5
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Generative Platform Auto-Commit" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Watching: $WatchPath" -ForegroundColor Green
Write-Host "Debounce: $DebounceSeconds seconds" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop watching..." -ForegroundColor Yellow
Write-Host ""

$global:lastCommitTime = [DateTime]::MinValue
$global:pendingChanges = $false

function Invoke-AutoCommit {
    $now = Get-Date
    $timeSinceLastCommit = ($now - $global:lastCommitTime).TotalSeconds
    
    if ($timeSinceLastCommit -lt $DebounceSeconds) {
        $global:pendingChanges = $true
        return
    }
    
    Set-Location $WatchPath
    
    # Check if there are any changes
    $status = git status --porcelain 2>$null
    
    if ($status) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        $changedFiles = ($status | Measure-Object).Count
        
        Write-Host "[$timestamp] Detected $changedFiles changed file(s)" -ForegroundColor Yellow
        
        # Stage all changes
        git add -A 2>$null
        
        # Generate commit message
        $commitMessage = "Auto-commit: $changedFiles file(s) changed at $timestamp"
        
        # Commit
        $commitResult = git commit -m $commitMessage 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[$timestamp] Committed: $commitMessage" -ForegroundColor Green
            
            # Push to remote
            Write-Host "[$timestamp] Pushing to GitHub..." -ForegroundColor Cyan
            $pushResult = git push origin master 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "[$timestamp] Successfully pushed to GitHub!" -ForegroundColor Green
            } else {
                # Try main branch if master fails
                $pushResult = git push origin main 2>&1
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "[$timestamp] Successfully pushed to GitHub (main branch)!" -ForegroundColor Green
                } else {
                    Write-Host "[$timestamp] Push failed. Will retry on next change." -ForegroundColor Red
                    Write-Host $pushResult -ForegroundColor Red
                }
            }
        } else {
            Write-Host "[$timestamp] No changes to commit" -ForegroundColor Gray
        }
        
        $global:lastCommitTime = $now
        $global:pendingChanges = $false
    }
}

# Create FileSystemWatcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $WatchPath
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true
$watcher.NotifyFilter = [System.IO.NotifyFilters]::FileName -bor 
                        [System.IO.NotifyFilters]::DirectoryName -bor 
                        [System.IO.NotifyFilters]::LastWrite

# Define event actions
$action = {
    $path = $Event.SourceEventArgs.FullPath
    $changeType = $Event.SourceEventArgs.ChangeType
    
    # Ignore .git folder and auto-commit script itself
    if ($path -match "\.git" -or $path -match "auto-commit\.ps1") {
        return
    }
    
    # Ignore node_modules and other common folders
    if ($path -match "node_modules|\.next|dist|build|__pycache__|\.pyc") {
        return
    }
    
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] $changeType : $path" -ForegroundColor Gray
    
    # Trigger auto-commit after debounce
    Start-Sleep -Seconds $using:DebounceSeconds
    Invoke-AutoCommit
}

# Register events
$handlers = @()
$handlers += Register-ObjectEvent -InputObject $watcher -EventName Created -Action $action
$handlers += Register-ObjectEvent -InputObject $watcher -EventName Changed -Action $action
$handlers += Register-ObjectEvent -InputObject $watcher -EventName Deleted -Action $action
$handlers += Register-ObjectEvent -InputObject $watcher -EventName Renamed -Action $action

# Keep the script running
try {
    while ($true) {
        Wait-Event -Timeout 1
        
        # Check for pending changes
        if ($global:pendingChanges) {
            Invoke-AutoCommit
        }
    }
} finally {
    # Cleanup
    $handlers | ForEach-Object { Unregister-Event -SubscriptionId $_.Id }
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    Write-Host "`nAuto-commit stopped." -ForegroundColor Yellow
}
