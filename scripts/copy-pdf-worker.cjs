const fs = require('fs');
const path = require('path');

const source = path.resolve(__dirname, '..', 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.min.mjs');
const target = path.resolve(__dirname, '..', 'public', 'pdf.worker.min.mjs');

if (!fs.existsSync(source)) {
  console.error(`[copy-pdf-worker] source not found: ${source}`);
  process.exit(1);
}

fs.copyFileSync(source, target);
console.log(`[copy-pdf-worker] copied to ${target}`);
