@echo off
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
    echo Node.js not found. Please install from https://nodejs.org
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Installing... Please wait. Do not close this window.
    call npm install
    if errorlevel 1 (
        echo Install failed.
        pause
        exit /b 1
    )
)

if not exist "node_modules\expo" (
    echo Expo not found. Installing... Please wait.
    call npm install
    if errorlevel 1 (
        echo Install failed.
        pause
        exit /b 1
    )
)

if not exist "node_modules\react-native\package.json" (
    echo React Native missing or broken. Reinstalling everything... Please wait 5-10 min.
    if exist "node_modules" rmdir /s /q node_modules
    call npm install
    if errorlevel 1 (
        echo Install failed.
        pause
        exit /b 1
    )
)

if not exist "node_modules\babel-preset-expo" (
    echo Installing babel-preset-expo... Please wait.
    call npm install
    if errorlevel 1 (
        echo Install failed.
        pause
        exit /b 1
    )
)

echo.
echo Starting Expo...
echo When you see QR code: scan it with Expo Go on your phone.
echo.
node "%~dp0node_modules\expo\bin\cli" start

pause
