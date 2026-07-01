@echo off
echo.
echo   [**] CodeWithShivank Portfolio v2.0 - Git Push Utility
echo   Pushing code to: https://github.com/codewith-shivank/PortFolio_JS.git
echo.
cd /d %~dp0

echo   [..] Adding changes to Git...
git add .

echo   [..] Committing changes...
git commit -m "feat: upgrade portfolio to immersive React + Three.js + WebGL"

echo   [..] Pushing to main branch on GitHub...
git push origin main

if errorlevel 1 (
    echo.
    echo   [!!] Push failed. If this is a new branch or needs authentication, please check your Git config.
) else (
    echo.
    echo   [OK] Code successfully pushed to GitHub!
)
echo.
pause
