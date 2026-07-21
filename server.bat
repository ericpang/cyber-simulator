@echo off
setlocal enabledelayedexpansion
title Cyber Simulator Server Manager

if "%~1"=="start" goto start_server
if "%~1"=="stop" goto stop_server
if "%~1"=="restart" goto restart_server

:menu
cls
echo ====================================================
echo           Cyber Simulator Server Manager
echo ====================================================
echo  1. Start Server
echo  2. Stop Server
echo  3. Restart Server
echo  4. Exit
echo ====================================================
set /p choice="Select an option (1-4): "

if "%choice%"=="1" goto start_server
if "%choice%"=="2" goto stop_server
if "%choice%"=="3" goto restart_server
if "%choice%"=="4" exit /b
echo Invalid option, please try again.
timeout /t 2 >nul
goto menu

:start_server
echo.
call "%~dp0start_server.bat"
if "%~1"=="" goto menu
exit /b

:stop_server
echo.
call "%~dp0stop_server.bat"
if "%~1"=="" goto menu
exit /b

:restart_server
echo.
echo Restarting server...
call "%~dp0stop_server.bat"
timeout /t 1 /nobreak >nul
call "%~dp0start_server.bat"
if "%~1"=="" goto menu
exit /b
