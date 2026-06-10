const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      content = content.replace(/bg-gradient-to-r from-brand-500 to-brand-400 hover:from-brand-600 hover:to-brand-500/g, 'bg-premium-gradient hover:bg-premium-gradient-dark');
      content = content.replace(/bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400/g, 'bg-premium-gradient-dark hover:bg-premium-gradient');
      content = content.replace(/bg-gradient-to-r from-brand-500 to-brand-400/g, 'bg-premium-gradient');
      content = content.replace(/bg-gradient-to-r from-brand-600 to-brand-500/g, 'bg-premium-gradient-dark');

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'components'));
processDir(path.join(__dirname, 'app'));
