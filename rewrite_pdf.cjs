const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add PdfPage component
const pdfPageComp = `
const PdfPage = ({ children, pageNumber, totalPages }: { children: React.ReactNode, pageNumber: number, totalPages: number }) => (
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
);
`;

// Insert after imports
content = content.replace('// --- Full PDF Template Component ---', pdfPageComp + '\n// --- Full PDF Template Component ---');

// 2. Update handleDownloadPdf
const oldDownload = `  const handleDownloadPdf = async () => {
    if (!pdfRef.current) return;
    setIsDownloading(true);
    setDownloadError(null);
    try {
      const canvas = await html2canvas(pdfRef.current, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('job_application.pdf');
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      setDownloadError(error.message || 'Failed to generate PDF. Try opening the app in a new tab.');
    } finally {
      setIsDownloading(false);
    }
  };`;

const newDownload = `  const handleDownloadPdf = async () => {
    if (!pdfRef.current) return;
    setIsDownloading(true);
    setDownloadError(null);
    try {
      const pages = pdfRef.current.querySelectorAll('.pdf-page');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        const canvas = await html2canvas(page, { 
          scale: 2, 
          useCORS: true,
          backgroundColor: '#ffffff'
        });
        const imgData = canvas.toDataURL('image/png');
        
        if (i > 0) {
          pdf.addPage();
        }
        
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
      }
      
      pdf.save('job_application.pdf');
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      setDownloadError(error.message || 'Failed to generate PDF. Try opening the app in a new tab.');
    } finally {
      setIsDownloading(false);
    }
  };`;

content = content.replace(oldDownload, newDownload);

fs.writeFileSync('src/App.tsx', content, 'utf8');
