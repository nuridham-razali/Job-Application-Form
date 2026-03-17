const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = content.indexOf('<div ref={pdfRef}');
const endIndex = content.indexOf('// Reusable UI Components for the Form');

let pdfSection = content.substring(startIndex, endIndex);

// Let's just count the open and close divs in pdfSection
let openDivs = (pdfSection.match(/<div/g) || []).length;
let closeDivs = (pdfSection.match(/<\/div>/g) || []).length;

console.log('Open divs:', openDivs);
console.log('Close divs:', closeDivs);

// The issue is that we are replacing the end of the section, but there are extra closing divs.
// Let's look at the end of the file.
console.log(pdfSection.substring(pdfSection.length - 200));
