const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = content.indexOf('<div ref={pdfRef}');
const endIndex = content.indexOf('// Reusable UI Components for the Form');

let pdfSection = content.substring(startIndex, endIndex);

// Let's count the open and close divs in pdfSection again
let openDivs = (pdfSection.match(/<div/g) || []).length;
let closeDivs = (pdfSection.match(/<\/div>/g) || []).length;

console.log('Open divs:', openDivs);
console.log('Close divs:', closeDivs);

let openPdfPages = (pdfSection.match(/<PdfPage/g) || []).length;
let closePdfPages = (pdfSection.match(/<\/PdfPage>/g) || []).length;

console.log('Open PdfPages:', openPdfPages);
console.log('Close PdfPages:', closePdfPages);

// If there's a mismatch, we need to fix it.
// The error says:
// 607|              </div>
// 608|            </div>
// 609|          </PdfPage>
//    |            ^
// 610|        </div>
// 611|      </div>
//
// Unexpected closing "PdfPage" tag does not match opening "div" tag

// This means there is an unclosed <div> inside the last <PdfPage>.
// Let's look at the last <PdfPage> content.
const lastPdfPage = pdfSection.substring(pdfSection.lastIndexOf('<PdfPage pageNumber={5}'));
console.log(lastPdfPage);

