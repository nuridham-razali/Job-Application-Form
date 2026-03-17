const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = content.indexOf('<div ref={pdfRef}');
const endIndex = content.indexOf('// Reusable UI Components for the Form');

let pdfSection = content.substring(startIndex, endIndex);

// Remove items-center from spans that have flex-1 but not flex
pdfSection = pdfSection.replace(/className="([^"]*)"/g, (match, p1) => {
  const classes = p1.split(' ');
  if (classes.includes('flex-1') && !classes.includes('flex') && classes.includes('items-center')) {
    return `className="${classes.filter(c => c !== 'items-center').join(' ')}"`;
  }
  return match;
});

content = content.substring(0, startIndex) + pdfSection + content.substring(endIndex);

fs.writeFileSync('src/App.tsx', content, 'utf8');
