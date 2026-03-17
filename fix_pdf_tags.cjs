const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = content.indexOf('<div ref={pdfRef}');
const endIndex = content.indexOf('// Reusable UI Components for the Form');

let pdfSection = content.substring(startIndex, endIndex);

// We need to make sure the tags match up.
// Looking at the error:
// 599|      </div>
//    |        ^
// 600|    </div>
// 601|    );
// 602|  };

// The issue is that the wrapper <div ref={pdfRef}...> is closed with </div></div>, but we replaced the inner content with <PdfPage> tags.
// Let's count the <PdfPage> and </PdfPage> tags.
const openCount = (pdfSection.match(/<PdfPage/g) || []).length;
const closeCount = (pdfSection.match(/<\/PdfPage>/g) || []).length;

console.log('Open PdfPage tags:', openCount);
console.log('Close PdfPage tags:', closeCount);

// Let's just manually fix the end of the pdfSection
const endOfPdfSection = `        </PdfPage>
      </div>
    </div>
  );
};
`;

// Replace the end
pdfSection = pdfSection.replace(/<\/PdfPage>\s*<\/div>\s*<\/div>\s*\);\s*};\s*$/g, endOfPdfSection);

// Wait, let's look at the actual end of pdfSection
console.log('End of pdfSection:', pdfSection.substring(pdfSection.length - 200));

