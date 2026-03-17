const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = content.indexOf('<div ref={pdfRef}');
const endIndex = content.indexOf('// Reusable UI Components for the Form');

let pdfSection = content.substring(startIndex, endIndex);

// Fix the main header table row
pdfSection = pdfSection.replace(
  '<div className="flex border-2 border-[#000000] mb-2 items-center">',
  '<div className="flex border-2 border-[#000000] mb-2 items-stretch">'
);

// Fix the logo/title row
pdfSection = pdfSection.replace(
  '<div className="flex border-b-2 border-[#000000] h-20 items-center">',
  '<div className="flex border-b-2 border-[#000000] h-20 items-stretch">'
);

// Fix all the form rows to stretch so borders connect
pdfSection = pdfSection.replace(
  /className="flex border-b border-\[#000000\] items-center"/g,
  'className="flex border-b border-[#000000] items-stretch"'
);
pdfSection = pdfSection.replace(
  /className="flex border-b border-\[#000000\] min-h-\[40px\] items-center"/g,
  'className="flex border-b border-[#000000] min-h-[40px] items-stretch"'
);

content = content.substring(0, startIndex) + pdfSection + content.substring(endIndex);

fs.writeFileSync('src/App.tsx', content, 'utf8');
