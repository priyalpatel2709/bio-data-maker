import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportPdfOptions {
  filename?: string;
  onProgress?: (progress: number, stage: string) => void;
}

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
/** ~96dpi CSS pixels for 210mm — keeps Tailwind sm/md breakpoints stable during capture */
const A4_WIDTH_PX = 794;

type TransformSnapshot = { node: HTMLElement; transform: string };

function clearTransformChain(element: HTMLElement): TransformSnapshot[] {
  const saved: TransformSnapshot[] = [];
  let node: HTMLElement | null = element;

  while (node && node !== document.documentElement) {
    saved.push({ node, transform: node.style.transform });
    node.style.transform = 'none';
    node = node.parentElement;
  }

  return saved;
}

function restoreTransformChain(saved: TransformSnapshot[]): void {
  saved.forEach(({ node, transform }) => {
    node.style.transform = transform;
  });
}

/** Apply html2canvas-safe styles on the cloned DOM (preview layout stays unchanged). */
function prepareClonedDocumentForCapture(clonedDoc: Document, elementId: string): void {
  const clonedElement = clonedDoc.getElementById(elementId);
  if (!clonedElement) return;

  clonedElement.style.transform = 'none';
  clonedElement.style.margin = '0';
  clonedElement.style.boxShadow = 'none';

  let parent: HTMLElement | null = clonedElement.parentElement;
  while (parent && parent !== clonedDoc.documentElement) {
    parent.style.transform = 'none';
    parent = parent.parentElement;
  }

  const fixStyle = clonedDoc.createElement('style');
  fixStyle.textContent = `
    #${elementId} img,
    #${elementId} svg {
      display: inline-block !important;
      vertical-align: middle;
    }
    #${elementId} [class*="items-baseline"] {
      align-items: flex-start !important;
    }
  `;
  clonedDoc.head.appendChild(fixStyle);

  clonedElement.querySelectorAll('img').forEach((img) => {
    const el = img as HTMLImageElement;
    el.style.display = 'inline-block';
    el.style.verticalAlign = 'middle';
  });

  clonedElement.querySelectorAll('[class*="items-baseline"]').forEach((row) => {
    (row as HTMLElement).style.alignItems = 'flex-start';
  });
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

  await document.fonts.ready;

  const transformSnapshots = clearTransformChain(element);
  const scrollParent = element.closest('.overflow-auto');
  const previousScrollTop =
    scrollParent instanceof HTMLElement ? scrollParent.scrollTop : null;

  if (scrollParent instanceof HTMLElement) {
    scrollParent.scrollTop = 0;
  }

  try {
    const captureScale = Math.min(2.5, Math.max(2, window.devicePixelRatio || 2));

    const canvas = await html2canvas(element, {
      scale: captureScale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 15000,
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: A4_WIDTH_PX,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        prepareClonedDocumentForCapture(clonedDoc, elementId);
      },
    });

    onProgress?.(50, 'Processing crystal-clear document pages...');

    const a4Ratio = A4_HEIGHT_MM / A4_WIDTH_MM;
    const pageCanvasHeight = Math.round(canvas.width * a4Ratio);

    const totalHeight = canvas.height;
    const totalPages = Math.max(1, Math.ceil(totalHeight / pageCanvasHeight));

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

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
      const slicePdfHeight = (sliceHeight / pageCanvasHeight) * A4_HEIGHT_MM;

      const pageCanvas = window.document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = pageCanvasHeight;
      const ctx = pageCanvas.getContext('2d');

      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvasHeight);

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

        const pageImgData = pageCanvas.toDataURL('image/png');
        pdf.addImage(
          pageImgData,
          'PNG',
          0,
          0,
          A4_WIDTH_MM,
          slicePdfHeight,
          undefined,
          'SLOW'
        );
      }
    }

    onProgress?.(95, 'Finalizing download package...');
    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
    onProgress?.(100, 'Complete!');
  } finally {
    restoreTransformChain(transformSnapshots);
    if (scrollParent instanceof HTMLElement && previousScrollTop !== null) {
      scrollParent.scrollTop = previousScrollTop;
    }
  }
}
