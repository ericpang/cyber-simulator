@echo off
setlocal enabledelayedexpansion
title Cyber Simulator Server

echo ====================================================
echo      Starting Cyber Simulator Server (Port 8000)
echo ====================================================
echo.

rem Check if port 8000 is already in use
netstat -aon | findstr LISTENING | findstr :8000 >nul 2>&1
if !errorlevel! equ 0 (
    echo [!] Server appears to be running already on port 8000.
    echo Opening browser at http://localhost:8000...
    start http://localhost:8000
    echo.
    pause
    exit /b
)

echo Starting Python HTTP Server...
start "Cyber Simulator Server" cmd /c "py -m http.server 8000"

echo Waiting for server to start...
timeout /t 2 /nobreak >nul

echo Opening http://localhost:8000 in your browser...
start http://localhost:8000

echo.
echo [✓] Server started successfully on http://localhost:8000!
echo [i] Run stop_server.bat whenever you want to stop the server.
echo.
timeout /t 3 >nul
