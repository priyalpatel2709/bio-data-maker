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

  onProgress?.(10, 'Initializing high-resolution renderer...');

  // Configure high-DPI canvas capture with scale 2.8 (~300 DPI for ultra-crisp print quality)
  const canvas = await html2canvas(element, {
    scale: 2.8,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    imageTimeout: 15000,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
    onclone: (clonedDoc) => {
      const clonedElement = clonedDoc.getElementById(elementId);
      if (clonedElement) {
        clonedElement.style.transform = 'none';
        clonedElement.style.margin = '0';
      }
    },
  });

  onProgress?.(50, 'Processing crystal-clear document pages...');

  // Standard A4 aspect ratio: 210mm x 297mm (Ratio: 297 / 210 = 1.4142857)
  const a4Ratio = 297 / 210;
  const pageCanvasHeight = Math.round(canvas.width * a4Ratio);

  const totalHeight = canvas.height;
  const totalPages = Math.max(1, Math.ceil(totalHeight / pageCanvasHeight));

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pdfWidth = 210;
  const pdfHeight = 297;

  // Render each A4 page slice with 0.98 JPEG quality (virtually uncompressed print fidelity)
  for (let page = 0; page < totalPages; page++) {
    onProgress?.(
      50 + Math.round(((page + 1) / totalPages) * 40),
      `Rendering page ${page + 1} of ${totalPages}...`
    );

    if (page > 0) {
      pdf.addPage();
    }

    const srcY = page * pageCanvasHeight;
    const sliceHeight = Math.min(pageCanvasHeight, totalHeight - srcY);

    // Create pristine page canvas
    const pageCanvas = window.document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = pageCanvasHeight;
    const ctx = pageCanvas.getContext('2d');

    if (ctx) {
      // Fill clean background to avoid transparency artifacts
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvasHeight);

      // Draw the exact page slice
      ctx.drawImage(
        canvas,
        0,
        srcY,
        canvas.width,
        sliceHeight,
        0,
        0,
        canvas.width,
        sliceHeight
      );

      // Top quality image data
      const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.98);
      pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    }
  }

  onProgress?.(95, 'Finalizing download package...');
  pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
  onProgress?.(100, 'Complete!');
}
