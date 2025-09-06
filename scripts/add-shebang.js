/* scripts/add-shebang.js */
const fs = require('fs');
const path = require('path');

const outPath = path.resolve(__dirname, '..', 'dist', 'cli.js');

try {
  if (!fs.existsSync(outPath)) {
    console.warn('add-shebang: output file not found:', outPath);
    process.exit(0);
  }

  const content = fs.readFileSync(outPath, 'utf8');
  if (content.startsWith('#!')) {
    // already has shebang
    process.exit(0);
  }

  const newContent = '#!/usr/bin/env node\n' + content;
  fs.writeFileSync(outPath, newContent, { mode: 0o755 });
  console.log('add-shebang: shebang added to', outPath);
} catch (err) {
  console.error('add-shebang: error', err);
  process.exit(1);
}
