const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = content.indexOf('<div ref={pdfRef}');
const endIndex = content.indexOf('// Reusable UI Components for the Form');

let pdfSection = content.substring(startIndex, endIndex);

// Ah, I see the problem.
// The end of Section 9 is missing </PdfPage> before the start of Page 5.
// Let's look at this part:
//           <div className="flex mt-8 p-2 items-center">
//             <div className="w-1/2 flex flex-col items-center">
//               <div className="w-48 border-b border-[#000000] mb-1"></div>
//               <div>Tandatangan Pemohon / <span className="italic">Signature</span></div>
//             </div>
//             <div className="w-1/2 flex flex-col items-center">
//               <div className="w-48 border-b border-[#000000] mb-1"></div>
//               <div>Tarikh / <span className="italic">Date</span></div>
//             </div>
//           </div>
//         
//
//         
//           {/* Section 10: Untuk Kegunaan Pejabat */}

const badPart = `          <div className="flex mt-8 p-2 items-center">
            <div className="w-1/2 flex flex-col items-center">
              <div className="w-48 border-b border-[#000000] mb-1"></div>
              <div>Tandatangan Pemohon / <span className="italic">Signature</span></div>
            </div>
            <div className="w-1/2 flex flex-col items-center">
              <div className="w-48 border-b border-[#000000] mb-1"></div>
              <div>Tarikh / <span className="italic">Date</span></div>
            </div>
          </div>
        

        
          {/* Section 10: Untuk Kegunaan Pejabat */}`;

const goodPart = `          <div className="flex mt-8 p-2 items-center">
            <div className="w-1/2 flex flex-col items-center">
              <div className="w-48 border-b border-[#000000] mb-1"></div>
              <div>Tandatangan Pemohon / <span className="italic">Signature</span></div>
            </div>
            <div className="w-1/2 flex flex-col items-center">
              <div className="w-48 border-b border-[#000000] mb-1"></div>
              <div>Tarikh / <span className="italic">Date</span></div>
            </div>
          </div>
        </div>
        </PdfPage>

        <PdfPage pageNumber={5} totalPages={5}>
          {/* Section 10: Untuk Kegunaan Pejabat */}`;

pdfSection = pdfSection.replace(badPart, goodPart);

content = content.substring(0, startIndex) + pdfSection + content.substring(endIndex);

fs.writeFileSync('src/App.tsx', content, 'utf8');
