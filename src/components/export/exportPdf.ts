import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportPdfOptions {
  filename?: string;
  onProgress?: (progress: number, stage: string) => void;
}

export async function exportBiodataToPdf(
  elementId: string = 'printable-biodata',
  options: ExportPdfOptions = {}
): Promise<void> {
  const { filename = 'biodata.pdf', onProgress } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Export target #${elementId} not found in DOM`);
  }

  onProgress?.(15, 'Preparing document render...');

  // Configure high-DPI canvas capture
  const canvas = await html2canvas(element, {
    scale: 2.5, // 2.5x for crisp print resolution (approx 240-300 DPI)
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
    onclone: (clonedDoc) => {
      const clonedElement = clonedDoc.getElementById(elementId);
      if (clonedElement) {
        // Ensure standard dimensions during clone
        clonedElement.style.transform = 'none';
        clonedElement.style.margin = '0';
      }
    },
  });

  onProgress?.(60, 'Generating PDF pages...');

  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  // A4 dimensions in mm: 210 x 297
  const pdfWidth = 210;
  const pdfHeight = 297;

  // Calculate height ratio
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  let heightLeft = imgHeight;
  let position = 0;

  // First page
  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
  heightLeft -= pdfHeight;

  // Subsequent pages if content overflows A4 height
  while (heightLeft > 5) {
    onProgress?.(80, 'Formatting multi-page document...');
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;
  }

  onProgress?.(95, 'Saving PDF file...');
  pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
  onProgress?.(100, 'Complete!');
}
