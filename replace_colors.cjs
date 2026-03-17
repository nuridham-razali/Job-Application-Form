const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// We only want to replace inside SamplePdfPreview
const startIndex = content.indexOf('const SamplePdfPreview');
const endIndex = content.indexOf('// Reusable UI Components for the Form');

if (startIndex !== -1 && endIndex !== -1) {
  let previewContent = content.substring(startIndex, endIndex);
  
  // Replace colors
  previewContent = previewContent
    .replace(/\bbg-white\b/g, 'bg-[#ffffff]')
    .replace(/\btext-black\b/g, 'text-[#000000]')
    .replace(/\bborder-black\b/g, 'border-[#000000]')
    .replace(/\bbg-gray-500\b/g, 'bg-[#6b7280]')
    .replace(/\btext-white\b/g, 'text-[#ffffff]')
    .replace(/\bbg-gray-400\b/g, 'bg-[#9ca3af]')
    .replace(/\btext-gray-500\b/g, 'text-[#6b7280]');

  content = content.substring(0, startIndex) + previewContent + content.substring(endIndex);
  fs.writeFileSync('src/App.tsx', content, 'utf8');
  console.log('Replaced colors in SamplePdfPreview');
} else {
  console.log('Could not find SamplePdfPreview bounds');
}
