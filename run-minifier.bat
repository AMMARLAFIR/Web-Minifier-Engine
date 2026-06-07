@echo off
SETLOCAL EnableDelayedExpansion
title Full-Auto Dependency & Minifier Engine

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo [SUCCESS] Node.js detected.
    goto :dependencies
)

echo [WARNING] Node.js is not installed on this system.
echo [PROCESS] Attempting automatic installation via Windows Package Manager...

:: 2. Try installing via winget (Standard on Windows 10/11)
where winget >nul 2>nul
if %errorlevel% equ 0 (
    echo [INFO] Installing Node.js (LTS version) silently...
    winget install OpenJS.NodeJS.LTS --silent --accept-source-agreements --accept-package-agreements
    if %errorlevel% equ 0 (
        echo [SUCCESS] Node.js installed successfully via winget.
        goto :refresh_env
    )
)

:: 3. Fallback: If winget fails, download the MSI installer directly via PowerShell
echo [INFO] winget unavailable or failed. Downloading official Node.js installer...
set "NODE_MSI=%TEMP%\node_install.msi"
powershell -Command "(New-Object Net.WebClient).DownloadFile('https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi', '%NODE_MSI%')"

echo [INFO] Running Node.js installer silently (this may take a moment)...
msiexec /i "%NODE_MSI%" /qn /norestart
if %errorlevel% neq 0 (
    echo [ERROR] Automated installation failed. Please install Node.js manually from https://nodejs.org/
    pause
    exit /b
)
echo [SUCCESS] Node.js installed successfully via standalone installer.

:refresh_env
:: 4. Dynamically update the PATH variable for this session so we don't have to restart the cmd window
echo [INFO] Refreshing system environment variables...
for /f "tokens=2*" %%A in ('reg query "HKLM\System\CurrentControlSet\Control\Session Manager\Environment" /v Path') do set "SYS_PATH=%%B"
for /f "tokens=2*" %%A in ('reg query "HKCU\Environment" /v Path') do set "USER_PATH=%%B"
set "PATH=%SYS_PATH%;%USER_PATH%"

:: 5. Verify the installation worked
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js installed but could not be registered in this session. Please close this window and re-run the script.
    pause
    exit /b
)

:dependencies
:: 6. Check and install local node packages
if not exist "node_modules\" (
    echo [INFO] Dependencies not found. Installing required minifier engines...
    if not exist "package.json" (
        call npm init -y >nul
    )
    call npm install html-minifier clean-css terser --no-audit --no-fund
    echo [SUCCESS] Core minifier modules installed successfully.
) else (
    echo [INFO] Dependencies verified.
)

echo [PROCESS] Initializing isolated directory cloning and minification...
node minify-script.js

echo.
echo [FINISHED] Build completed! Your untouched source code remains safe.
echo [OUTPUT] Check the "dist" folder for your minified files.
pause
