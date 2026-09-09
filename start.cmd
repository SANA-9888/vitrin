@echo off
setlocal
chcp 65001 >nul

cd /d "%~dp0"
title Vitrin Installer

echo.
echo =========================================
echo          VITRIN INSTALLER
echo =========================================
echo.
echo Starting installation...
echo Log file: install.log
echo.

where powershell.exe >nul 2>nul
if errorlevel 1 (
    echo ERROR: Windows PowerShell was not found.
    pause
    exit /b 1
)

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -Command ^
 "$utf8 = New-Object System.Text.UTF8Encoding; [Console]::OutputEncoding = $utf8; $OutputEncoding = $utf8; & powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File '.\install-windows.ps1' 2>&1 | Tee-Object -FilePath '.\install.log'; $result = $LASTEXITCODE; exit $result"

set "RESULT=%ERRORLEVEL%"

echo.
echo =========================================

if not "%RESULT%"=="0" (
    echo INSTALLATION FAILED
    echo.
    echo Read the English error message above.
    echo Full output was saved to install.log
    echo.
    echo Before sharing the log, remove any tokens
    echo or other private information.
) else (
    echo INSTALLATION COMPLETED
)

echo =========================================
echo.
pause
exit /b %RESULT%