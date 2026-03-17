const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = content.indexOf('<div ref={pdfRef}');
const endIndex = content.indexOf('// Reusable UI Components for the Form');

let pdfSection = content.substring(startIndex, endIndex);

// Replace p-1 with p-1.5
pdfSection = pdfSection.replace(/p-1\b/g, 'p-1.5');

// Add items-center to flex rows that don't have it, except flex-col
pdfSection = pdfSection.replace(/className="([^"]*\bflex\b[^"]*)"/g, (match, p1) => {
  if (p1.includes('items-center') || p1.includes('flex-col')) {
    return match;
  }
  return `className="${p1} items-center"`;
});

content = content.substring(0, startIndex) + pdfSection + content.substring(endIndex);

fs.writeFileSync('src/App.tsx', content, 'utf8');
