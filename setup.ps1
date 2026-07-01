# ╔══════════════════════════════════════════════════════╗
# ║  CodeWithShivank Portfolio — Setup & Launch Script   ║
# ╚══════════════════════════════════════════════════════╝
# Run this once to install all dependencies and start the dev server.
# Usage: Right-click this file → "Run with PowerShell"
#        OR open PowerShell in this folder and type: .\setup.ps1

Write-Host ""
Write-Host "  🌌 CodeWithShivank Portfolio v2.0" -ForegroundColor Cyan
Write-Host "  Immersive WebGL + React + Three.js + Physics" -ForegroundColor DarkCyan
Write-Host ""

# ── Navigate to script directory ─────────────────────────────────────────────
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptDir

Write-Host "  📦 Installing dependencies..." -ForegroundColor Yellow
Write-Host "  (This may take 2-3 minutes on first run)" -ForegroundColor DarkGray
Write-Host ""

try {
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
    Write-Host ""
    Write-Host "  ✅ Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "  ❌ npm install failed: $_" -ForegroundColor Red
    Write-Host "  Try running: npm install --force" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host ""
Write-Host "  🚀 Starting dev server..." -ForegroundColor Cyan
Write-Host "  → Open http://localhost:3000 in your browser" -ForegroundColor Green
Write-Host ""
Write-Host "  💡 Controls:" -ForegroundColor DarkCyan
Write-Host "    • Scroll to fly through sections" -ForegroundColor Gray
Write-Host "    • Click planets to see skill details" -ForegroundColor Gray
Write-Host "    • Drag and fling project cards!" -ForegroundColor Gray
Write-Host "    • Try: ↑↑↓↓←→←→BA  (Konami code)" -ForegroundColor Gray
Write-Host "    • Click 5 times to draw constellations" -ForegroundColor Gray
Write-Host "    • Right-click for custom context menu" -ForegroundColor Gray
Write-Host ""

npm run dev
