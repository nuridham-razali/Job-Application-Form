const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = content.indexOf('<div ref={pdfRef}');
const endIndex = content.indexOf('// Reusable UI Components for the Form');

let pdfSection = content.substring(startIndex, endIndex);

// Let's just rewrite the end of the section manually.
// The structure is:
// <div ref={pdfRef} ...>
//   <PdfPage ...>
//     ...
//   </PdfPage>
//   ...
//   <PdfPage ...>
//     <div className="border-2 border-[#000000] mb-2 h-full flex flex-col">
//       ...
//       <div className="p-2 flex-1">
//         ...
//         <div className="mt-8 w-1/2">
//           <table ...>
//             <tbody>
//               ...
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   </PdfPage>
// </div>

const badEnd = `              </div>
            </div>
          </div>
        </PdfPage>
      </div>
    </div>
  );
};`;

const goodEnd = `              </div>
            </div>
          </div>
        </PdfPage>
      </div>
    </div>
  );
};`;

// Let's just find the last </table> and replace everything after it.
const lastTableIndex = pdfSection.lastIndexOf('</table>');
const afterTable = pdfSection.substring(lastTableIndex);

console.log('After table:', afterTable);

const newAfterTable = `</table>
              </div>
            </div>
          </div>
        </PdfPage>
      </div>
    </div>
  );
};
`;

pdfSection = pdfSection.substring(0, lastTableIndex) + newAfterTable;

content = content.substring(0, startIndex) + pdfSection + content.substring(endIndex);

fs.writeFileSync('src/App.tsx', content, 'utf8');
