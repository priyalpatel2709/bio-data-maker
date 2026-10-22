import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportResumePdfOptions {
  filename?: string;
  paperSize?: 'a4' | 'letter';
  onProgress?: (progress: number, stage: string) => void;
}

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const LETTER_WIDTH_MM = 215.9;
const LETTER_HEIGHT_MM = 279.4;

export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;
export const LETTER_WIDTH_PX = 816;
export const LETTER_HEIGHT_PX = 1056;

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

export async function exportResumeToPdf(
  containerId: string = 'resume-preview-document',
  options: ExportResumePdfOptions = {}
): Promise<void> {
  const {
    filename = 'Resume.pdf',
    paperSize = 'a4',
    onProgress,
  } = options;

  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Target resume preview element #${containerId} not found in DOM`);
  }

  onProgress?.(10, 'Initializing vector engine & loading fonts...');

  // Ensure all fonts are ready
  await document.fonts.ready;

  const isLetter = paperSize === 'letter';
  const widthMm = isLetter ? LETTER_WIDTH_MM : A4_WIDTH_MM;
  const heightMm = isLetter ? LETTER_HEIGHT_MM : A4_HEIGHT_MM;
  const widthPx = isLetter ? LETTER_WIDTH_PX : A4_WIDTH_PX;
  const heightPx = isLetter ? LETTER_HEIGHT_PX : A4_HEIGHT_PX;

  // Clear transforms up the ancestor tree
  const transformSnapshots = clearTransformChain(container);
  const scrollParent = container.closest('.overflow-auto');
  const previousScrollTop = scrollParent instanceof HTMLElement ? scrollParent.scrollTop : null;
  if (scrollParent instanceof HTMLElement) {
    scrollParent.scrollTop = 0;
  }

  try {
    // Find all discrete page sheets (.resume-page-sheet)
    const pageSheets = Array.from(
      container.querySelectorAll<HTMLElement>('.resume-page-sheet')
    );
    const targets = pageSheets.length > 0 ? pageSheets : [container];
    const totalPages = targets.length;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: isLetter ? 'letter' : 'a4',
      compress: true,
    });

    const captureScale = Math.min(2.5, Math.max(2, window.devicePixelRatio || 2));

    for (let i = 0; i < totalPages; i++) {
      const pageEl = targets[i];
      const pageNum = i + 1;

      onProgress?.(
        20 + Math.round((pageNum / totalPages) * 70),
        `Rendering Page ${pageNum} of ${totalPages}...`
      );

      if (i > 0) {
        pdf.addPage();
      }

      const canvas = await html2canvas(pageEl, {
        scale: captureScale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 15000,
        width: widthPx,
        height: heightPx,
        windowWidth: widthPx,
        windowHeight: heightPx,
        onclone: (clonedDoc) => {
          const clonedTarget = clonedDoc.getElementById(pageEl.id) || clonedDoc.querySelector('.resume-page-sheet');
          if (clonedTarget) {
            (clonedTarget as HTMLElement).style.transform = 'none';
            (clonedTarget as HTMLElement).style.margin = '0';
            (clonedTarget as HTMLElement).style.boxShadow = 'none';
          }
          const style = clonedDoc.createElement('style');
          style.textContent = `
            .preview-page-break-line, .preview-page-header, .preview-page-footer {
              display: none !important;
            }
            img, svg {
              display: inline-block !important;
              vertical-align: middle;
            }
          `;
          clonedDoc.head.appendChild(style);
        },
      });

      const pageImgData = canvas.toDataURL('image/png');

      // Add full-size A4 image without any squishing or clipping
      pdf.addImage(
        pageImgData,
        'PNG',
        0,
        0,
        widthMm,
        heightMm,
        undefined,
        'FAST'
      );
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
