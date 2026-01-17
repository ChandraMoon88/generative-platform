@echo off
echo Starting Auto-Commit for Generative Platform...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0auto-commit.ps1" -WatchPath "%~dp0"
pause
