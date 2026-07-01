/**
 * Portfolio Bootstrap Script
 * Run with: node bootstrap.js
 * This installs dependencies and starts the Vite dev server.
 */
const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectDir = __dirname;
process.chdir(projectDir);

console.log('\n  🌌 CodeWithShivank Portfolio v2.0');
console.log('  ─────────────────────────────────────');

// Ensure public directory exists and copy Profile picture
const publicDir = path.join(projectDir, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
const srcProfile = path.join(projectDir, 'Profile insta.jpg');
const destProfile = path.join(publicDir, 'Profile insta.jpg');
if (fs.existsSync(srcProfile) && !fs.existsSync(destProfile)) {
  try {
    fs.copyFileSync(srcProfile, destProfile);
    console.log('  🎨 Copied profile image to public directory.');
  } catch (e) {
    console.warn('  ⚠️ Failed to copy profile image:', e.message);
  }
}

// Check if node_modules exists
const nodeModulesExist = fs.existsSync(path.join(projectDir, 'node_modules', 'vite'));

if (!nodeModulesExist) {
  console.log('\n  📦 Installing dependencies...');
  console.log('  (This takes 2-3 minutes on first run)\n');
  try {
    execSync('npm install --legacy-peer-deps', {
      stdio: 'inherit',
      cwd: projectDir,
      shell: true,
    });
    console.log('\n  ✅ Dependencies installed!\n');
  } catch (err) {
    console.error('\n  ❌ npm install failed. Trying --force...\n');
    try {
      execSync('npm install --force', { stdio: 'inherit', cwd: projectDir, shell: true });
    } catch (e) {
      console.error('  ❌ Both install attempts failed:', e.message);
      process.exit(1);
    }
  }
} else {
  console.log('\n  ✅ Dependencies already installed.\n');
}

console.log('  🚀 Starting dev server...');
console.log('  → Open http://localhost:3000 in your browser\n');
console.log('  🎮 Try: ↑↑↓↓←→←→BA for Konami code!');
console.log('  ⭐ Click 5 times to draw constellations!');
console.log('  🖱️  Right-click for custom menu!\n');

const vite = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  cwd: projectDir,
  shell: true,
});

vite.on('error', (err) => {
  console.error('Failed to start:', err.message);
});

process.on('SIGINT', () => {
  vite.kill();
  process.exit(0);
});
