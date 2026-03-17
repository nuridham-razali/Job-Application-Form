const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = content.indexOf('<div ref={pdfRef}');
const endIndex = content.indexOf('// Reusable UI Components for the Form');

let pdfSection = content.substring(startIndex, endIndex);

// Replace the photo box
const oldPhotoBox = `<div className="w-32 border-l-2 border-[#000000] p-2 flex flex-col items-center justify-center min-h-[140px]">
            {formData.photoBase64 ? (
              <img src={formData.photoBase64} alt="Applicant" className="max-h-full max-w-full object-cover" />
            ) : (
              <>
                <div className="font-bold text-lg">Gambar</div>
                <div className="italic text-sm">Photo</div>
              </>
            )}
          </div>`;

const newPhotoBox = `<div className="w-32 border-l-2 border-[#000000] flex flex-col items-center justify-center min-h-[140px] overflow-hidden bg-[#ffffff]">
            {formData.photoBase64 ? (
              <img src={formData.photoBase64} alt="Applicant" className="w-full h-full object-cover object-top" />
            ) : (
              <div className="flex flex-col items-center justify-center p-2 text-center">
                <div className="font-bold text-lg">Gambar</div>
                <div className="italic text-sm">Photo</div>
              </div>
            )}
          </div>`;

pdfSection = pdfSection.replace(oldPhotoBox, newPhotoBox);

content = content.substring(0, startIndex) + pdfSection + content.substring(endIndex);

fs.writeFileSync('src/App.tsx', content, 'utf8');
