const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = content.indexOf('<div ref={pdfRef}');
const endIndex = content.indexOf('// Reusable UI Components for the Form');

let pdfSection = content.substring(startIndex, endIndex);

// We have 125 open divs and 126 close divs.
// The end of the section is:
//           </div>
//         
//       </div>
//     </div>
//   </div>
//   );
// };
//
// But wait, the PdfPage component is closed with </PdfPage>.
// So the end should be:
//           </div>
//         </PdfPage>
//       </div>
//     </div>
//   );
// };

const badEnd = `              </div>
            </div>
          </div>
        
      </div>
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

pdfSection = pdfSection.replace(badEnd, goodEnd);

content = content.substring(0, startIndex) + pdfSection + content.substring(endIndex);

fs.writeFileSync('src/App.tsx', content, 'utf8');
