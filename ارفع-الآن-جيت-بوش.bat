@echo off
chcp 65001 >nul
set "REPO_DIR=C:\Users\lenovo\uno_mobile-repo"

if not exist "%REPO_DIR%" (
    echo شغّل أولاً: ارفع-كل-الملفات-لجيتهاب.bat
    pause
    exit /b 1
)

cd /d "%REPO_DIR%"
git add .
git status
echo.
echo إذا شفت الملفات صح، اضغط أي زر عشان نكمل commit و push...
pause >nul
git commit -m "اضافة تطبيق الموبايل في mobile-app"
git push
echo.
pause
