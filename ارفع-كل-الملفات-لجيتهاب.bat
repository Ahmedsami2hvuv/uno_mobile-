@echo off
chcp 65001 >nul
setlocal

echo ========================================
echo   رفع ملفات التطبيق كلها لـ GitHub
echo ========================================
echo.

set "REPO_URL=https://github.com/Ahmedsami2hvuv/uno_mobile-.git"
set "REPO_DIR=C:\Users\lenovo\uno_mobile-repo"
set "APP_DIR=C:\Users\lenovo\uno-mobile"

:: 1) استنساخ المستودع إذا ما موجود
if not exist "%REPO_DIR%" (
    echo [1/3] جاري استنساخ المستودع من GitHub...
    git clone %REPO_URL% "%REPO_DIR%"
    if errorlevel 1 (
        echo فشل الاستنساخ. تأكد من تثبيت Git ومن الرابط.
        pause
        exit /b 1
    )
) else (
    echo [1/3] المستودع موجود. جاري سحب آخر تحديث...
    cd /d "%REPO_DIR%"
    git pull
    cd /d "%~dp0"
)

:: 2) نسخ ملفات التطبيق إلى mobile-app (بدون node_modules وبدون uno-app-api)
echo.
echo [2/3] جاري نسخ كل ملفات التطبيق إلى مجلد mobile-app...
if not exist "%REPO_DIR%\mobile-app" mkdir "%REPO_DIR%\mobile-app"
if not exist "%REPO_DIR%\mobile-app\src" mkdir "%REPO_DIR%\mobile-app\src"
if not exist "%REPO_DIR%\mobile-app\src\logic" mkdir "%REPO_DIR%\mobile-app\src\logic"
if not exist "%REPO_DIR%\mobile-app\src\screens" mkdir "%REPO_DIR%\mobile-app\src\screens"

copy /Y "%APP_DIR%\App.js" "%REPO_DIR%\mobile-app\" >nul
copy /Y "%APP_DIR%\app.json" "%REPO_DIR%\mobile-app\" >nul
copy /Y "%APP_DIR%\package.json" "%REPO_DIR%\mobile-app\" >nul
copy /Y "%APP_DIR%\babel.config.js" "%REPO_DIR%\mobile-app\" >nul
copy /Y "%APP_DIR%\eas.json" "%REPO_DIR%\mobile-app\" >nul

copy /Y "%APP_DIR%\src\api.js" "%REPO_DIR%\mobile-app\src\" >nul
copy /Y "%APP_DIR%\src\railwayConfig.js" "%REPO_DIR%\mobile-app\src\" >nul
copy /Y "%APP_DIR%\src\AuthContext.js" "%REPO_DIR%\mobile-app\src\" >nul
copy /Y "%APP_DIR%\src\strings.js" "%REPO_DIR%\mobile-app\src\" >nul
copy /Y "%APP_DIR%\src\logic\unoLogic.js" "%REPO_DIR%\mobile-app\src\logic\" >nul

copy /Y "%APP_DIR%\src\screens\HomeScreen.js" "%REPO_DIR%\mobile-app\src\screens\" >nul
copy /Y "%APP_DIR%\src\screens\GameScreen.js" "%REPO_DIR%\mobile-app\src\screens\" >nul
copy /Y "%APP_DIR%\src\screens\RulesScreen.js" "%REPO_DIR%\mobile-app\src\screens\" >nul
copy /Y "%APP_DIR%\src\screens\CalcScreen.js" "%REPO_DIR%\mobile-app\src\screens\" >nul
copy /Y "%APP_DIR%\src\screens\AccountScreen.js" "%REPO_DIR%\mobile-app\src\screens\" >nul
copy /Y "%APP_DIR%\src\screens\AuthScreen.js" "%REPO_DIR%\mobile-app\src\screens\" >nul

echo    تم نسخ كل الملفات.
echo.

:: 3) تعليمات الرفع
echo [3/3] الآن ارفع التحديثات لـ GitHub بهالأمرين:
echo.
echo    افتح موجه أوامر جديد (CMD) واكتب:
echo.
echo    cd /d "%REPO_DIR%"
echo    git add .
echo    git status
echo    git commit -m "اضافة تطبيق الموبايل في mobile-app"
echo    git push
echo.
echo ========================================
echo إذا ما عندك Git أو ما راح يرفع، راح يفتح لك مجلد المستودع عشان ترفع من الموقع يدوياً (Upload).
echo ========================================
explorer "%REPO_DIR%"
pause
