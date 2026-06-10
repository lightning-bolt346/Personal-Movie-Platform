const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next') {
        walkDir(dirPath, callback);
      }
    } else {
      if (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.css')) {
        callback(dirPath);
      }
    }
  });
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Regex to match: color-mix(in srgb, var(--brand-500),0.xx)
  // and replace with: color-mix(in srgb, var(--brand-500) xx%, transparent)
  const regex = /color-mix\(in srgb,\s*var\(--brand-500\),0\.(\d+)\)/g;
  
  const newContent = content.replace(regex, (match, p1) => {
    changed = true;
    let percentage = parseInt(p1, 10);
    if (p1.length === 1) {
      percentage = percentage * 10;
    }
    return `color-mix(in srgb, var(--brand-500) ${percentage}%, transparent)`;
  });

  // Also fix var(--ambient-color) issue in PlayerToasts
  const ambientRegex1 = /color-mix\(in srgb, var\(--ambient-color, rgba\(255,255,255,0\.15\)\) 30%, rgba\(255,255,255,0\.07\)\)/g;
  const newContent2 = newContent.replace(ambientRegex1, 'var(--ambient-color, rgba(255,255,255,0.15))');
  
  const ambientRegex2 = /color-mix\(in srgb, var\(--ambient-color, rgba\(0,0,0,0\.8\)\) 20%, rgba\(0,0,0,0\.6\)\)/g;
  const newContent3 = newContent2.replace(ambientRegex2, 'var(--ambient-color, rgba(0,0,0,0.8))');

  // Also fix border-brand-/30 missing number in lib/providers.ts
  const newContent4 = newContent3.replace(/border-brand-\//g, 'border-brand-500/');
  const newContent5 = newContent4.replace(/bg-brand- /g, 'bg-brand-500 ');
  const newContent6 = newContent5.replace(/text-brand- /g, 'text-brand-500 ');
  const newContent7 = newContent6.replace(/from-brand-\//g, 'from-brand-500/');

  if (content !== newContent7) {
    fs.writeFileSync(filePath, newContent7, 'utf8');
    console.log('Fixed:', filePath);
  }
}

const dirs = ['./components', './app', './lib'];
dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    walkDir(dir, fixFile);
  }
});
