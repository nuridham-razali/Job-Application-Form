const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// The content to replace starts at <div ref={pdfRef}...> and ends at </div></div> // Reusable UI Components
const startIndex = content.indexOf('<div ref={pdfRef}');
const endIndex = content.indexOf('// Reusable UI Components for the Form');

let pdfSection = content.substring(startIndex, endIndex);

// We need to fix the PdfPage component to match the exact layout requested
const oldPdfPageComp = `const PdfPage = ({ children, pageNumber, totalPages }: { children: React.ReactNode, pageNumber: number, totalPages: number }) => (
  <div className="pdf-page flex flex-col justify-between p-8 text-[#000000] text-[11px] font-sans leading-normal bg-[#ffffff] w-[210mm] min-h-[297mm] mx-auto mb-4 border border-gray-300 shadow-lg print:border-none print:shadow-none print:mb-0 print:w-full print:h-auto box-border">
    <div className="flex-1">
      {children}
    </div>
    <div className="flex justify-between items-end text-[9px] mt-4 pt-2">
      <div>
        <div>FM-HR-02, Rev: 3, 05 March 2025</div>
        <div>Ref: SP-HR-01, DCM</div>
        <div>HALAGEL GROUP OF COMPANIES</div>
      </div>
      <div className="font-bold text-[11px]">
        {pageNumber} of {totalPages}
      </div>
    </div>
  </div>
);`;

const newPdfPageComp = `const PdfPage = ({ children, pageNumber, totalPages }: { children: React.ReactNode, pageNumber: number, totalPages: number }) => (
  <div className="pdf-page flex flex-col justify-between p-8 text-[#000000] text-[11px] font-sans leading-normal bg-[#ffffff] w-[210mm] min-h-[297mm] mx-auto mb-4 border border-gray-300 shadow-lg print:border-none print:shadow-none print:mb-0 print:w-full print:h-auto box-border">
    <div className="flex-1">
      {children}
    </div>
    <div className="flex justify-between items-end text-[9px] mt-4 pt-2">
      <div>
        <div>FM-HR-02, Rev: 3, 05 March 2025</div>
        <div>Ref: SP-HR-01, DCM</div>
        <div>HALAGEL GROUP OF COMPANIES</div>
      </div>
      <div className="font-bold text-[11px]">
        {pageNumber} of {totalPages}
      </div>
    </div>
  </div>
);`;

// Let's check if the PdfPage component is already there
if (content.includes('const PdfPage =')) {
  // It's there, no need to replace
}

// Now let's fix the page breaks in the pdfSection
// Page 1: Header, Section 1, Section 2
// Page 2: Section 3, Section 4, Section 5
// Page 3: Section 6, Section 7
// Page 4: Section 8, Section 9
// Page 5: Section 10 (Untuk Kegunaan Pejabat)

// First, let's remove any existing <PdfPage> tags to start clean
pdfSection = pdfSection.replace(/<PdfPage[^>]*>/g, '');
pdfSection = pdfSection.replace(/<\/PdfPage>/g, '');

// Now insert them at the correct locations
pdfSection = pdfSection.replace(
  '{/* Header Table */}',
  '<PdfPage pageNumber={1} totalPages={5}>\n        {/* Header Table */}'
);

pdfSection = pdfSection.replace(
  '{/* Section 3: Latar Belakang Pendidikan */}',
  '</PdfPage>\n\n        <PdfPage pageNumber={2} totalPages={5}>\n        {/* Section 3: Latar Belakang Pendidikan */}'
);

pdfSection = pdfSection.replace(
  '{/* Section 6: Kesihatan */}',
  '</PdfPage>\n\n        <PdfPage pageNumber={3} totalPages={5}>\n        {/* Section 6: Kesihatan */}'
);

pdfSection = pdfSection.replace(
  '{/* Section 8: Jika Anda Dipilih */}',
  '</PdfPage>\n\n        <PdfPage pageNumber={4} totalPages={5}>\n        {/* Section 8: Jika Anda Dipilih */}'
);

// The end of Section 9 is the end of Page 4
const section9End = `</div>
          <div className="flex mt-8 p-2 items-center">
            <div className="w-1/2 flex flex-col items-center">
              <div className="w-48 border-b border-[#000000] mb-1"></div>
              <div>Tandatangan Pemohon / <span className="italic">Signature</span></div>
            </div>
            <div className="w-1/2 flex flex-col items-center">
              <div className="w-48 border-b border-[#000000] mb-1"></div>
              <div>Tarikh / <span className="italic">Date</span></div>
            </div>
          </div>
        </div>`;

const page5Content = `</PdfPage>

        <PdfPage pageNumber={5} totalPages={5}>
          {/* Section 10: Untuk Kegunaan Pejabat */}
          <div className="border-2 border-[#000000] mb-2 h-full flex flex-col">
            <div className="bg-[#9ca3af] text-[#ffffff] font-bold px-2 py-1.5 border-b-2 border-[#000000]">
              Untuk Kegunaan Pejabat / <span className="italic font-normal">For Office Use</span>
            </div>
            
            <div className="p-2 flex-1">
              <div className="flex mb-4">
                <div className="w-1/2">
                  <div className="flex items-center mb-2">
                    <span className="mr-2">Tarikh Temuduga / <span className="italic text-[9px]">Date Of Interview</span> :</span>
                    <span className="flex-1 border-b border-[#000000] inline-block h-4"></span>
                  </div>
                  <div className="flex">
                    <span className="mr-2">Penemuduga :<br/><span className="italic text-[9px]">Interviewer</span></span>
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex items-center">1. <span className="flex-1 border-b border-[#000000] inline-block h-4 ml-1"></span></div>
                      <div className="flex items-center">2. <span className="flex-1 border-b border-[#000000] inline-block h-4 ml-1"></span></div>
                      <div className="flex items-center">3. <span className="flex-1 border-b border-[#000000] inline-block h-4 ml-1"></span></div>
                      <div className="flex items-center">4. <span className="flex-1 border-b border-[#000000] inline-block h-4 ml-1"></span></div>
                      <div className="flex items-center">5. <span className="flex-1 border-b border-[#000000] inline-block h-4 ml-1"></span></div>
                    </div>
                  </div>
                </div>
                
                <div className="w-1/2 pl-8 flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <span className="w-20">Keputusan<br/><span className="italic text-[9px]">Result</span></span>
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="flex items-center justify-between">
                        <span>: Terima/<span className="italic text-[9px]">Accept</span></span>
                        <div className="w-10 h-6 border border-[#000000]"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>: Tolak/<span className="italic text-[9px]">Reject</span></span>
                        <div className="w-10 h-6 border border-[#000000]"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>: KIV</span>
                        <div className="w-10 h-6 border border-[#000000]"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col mt-4">
                    <span className="mb-2 border-b border-[#000000] pb-1 inline-block w-48">Syarikat / <span className="italic text-[9px]">Company</span> :</span>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-6 border border-[#000000]"></div>
                      <span>Halagel (M) Sdn Bhd</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-6 border border-[#000000]"></div>
                      <span>Halagel Plant (M) Sdn Bhd</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-6 border border-[#000000]"></div>
                      <span>Halagel Products Sdn Bhd</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 w-1/2">
                <table className="w-full border-collapse border-2 border-[#000000]">
                  <tbody>
                    <tr>
                      <td className="border border-[#000000] p-1.5 w-1/2">Tarikh Mula Kerja<br/><span className="italic text-[9px]">Date start to Work</span></td>
                      <td className="border border-[#000000] p-1.5 w-1/2"></td>
                    </tr>
                    <tr>
                      <td className="border border-[#000000] p-1.5">Jawatan<br/><span className="italic text-[9px]">Position</span></td>
                      <td className="border border-[#000000] p-1.5"></td>
                    </tr>
                    <tr>
                      <td className="border border-[#000000] p-1.5">Jabatan<br/><span className="italic text-[9px]">Department</span></td>
                      <td className="border border-[#000000] p-1.5"></td>
                    </tr>
                    <tr>
                      <td className="border border-[#000000] p-1.5">Gaji Permulaan<br/><span className="italic text-[9px]">Starting Basic</span></td>
                      <td className="border border-[#000000] p-1.5"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </PdfPage>`;

// If page5Content is not already there, add it
if (!pdfSection.includes('Tarikh Temuduga')) {
  pdfSection = pdfSection.replace(section9End, section9End + '\n' + page5Content);
}

content = content.substring(0, startIndex) + pdfSection + content.substring(endIndex);

fs.writeFileSync('src/App.tsx', content, 'utf8');
