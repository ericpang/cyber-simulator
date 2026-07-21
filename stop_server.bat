@echo off
setlocal enabledelayedexpansion
title Stop Cyber Simulator Server

echo ====================================================
echo      Stopping Cyber Simulator Server (Port 8000)
echo ====================================================
echo.

set STOPPED=0
for /f "tokens=5" %%a in ('netstat -aon ^| findstr LISTENING ^| findstr :8000') do (
    set /a STOPPED+=1
    echo Terminating process PID %%a listening on port 8000...
    taskkill /F /PID %%a >nul 2>&1
)

if !STOPPED! GTR 0 (
    echo.
    echo [✓] Server stopped successfully.
) else (
    echo [!] No active server found listening on port 8000.
)

echo.
timeout /t 3 >nul
