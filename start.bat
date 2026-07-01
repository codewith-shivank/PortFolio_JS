@echo off
echo.
echo   [**] CodeWithShivank Portfolio v2.0 - Setup
echo   Immersive WebGL + React + Three.js + Physics
echo.
cd /d %~dp0
echo   [..] Installing dependencies (may take 2-3 minutes)...
echo.
npm install --legacy-peer-deps
if errorlevel 1 (
    echo.
    echo   [!!] npm install failed. Trying with --force...
    npm install --force
)
echo.
echo   [OK] Starting dev server at http://localhost:3000
echo.
echo   Controls:
echo     Scroll = fly through sections
echo     Click planets = skill details
echo     Drag project cards = physics!
echo     Konami: Up Up Down Down Left Right Left Right B A
echo     Right-click = custom menu
echo.
npm run dev
pause
