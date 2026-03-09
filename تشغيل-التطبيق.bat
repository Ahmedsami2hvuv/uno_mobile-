@echo off
chcp 65001 >nul
title تشغيل تطبيق أونو
echo.
echo ========================================
echo   تشغيل تطبيق أونو للموبايل
echo ========================================
echo.

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
    echo [خطأ] لم يتم العثور على Node.js.
    echo.
    echo يرجى تثبيت Node.js أولاً من:
    echo https://nodejs.org
    echo.
    echo بعد التثبيت أعد تشغيل هذا الملف.
    echo.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo جاري تثبيت المتطلبات لأول مرة... قد يستغرق دقيقة.
    echo.
    call npm install
    if errorlevel 1 (
        echo فشل التثبيت.
        pause
        exit /b 1
    )
    echo.
)

echo جاري تشغيل التطبيق...
echo.
echo عند ظهور رمز QR:
echo   - على أندرويد: افتح Expo Go وامسح الرمز
echo   - على آيفون: امسح الرمز بالكاميرا ثم افتح في Expo Go
echo.
echo تأكد أن الهاتف والكمبيوتر على نفس شبكة الواي فاي.
echo.
echo للإيقاف: أغلق هذه النافذة أو اضغط Ctrl+C
echo.

call npx expo start

pause
