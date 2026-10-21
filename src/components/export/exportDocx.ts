import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ImageRun,
} from 'docx';
import { saveAs } from 'file-saver';
import { BiodataDocument } from '../../types/biodata';
import { calculateAge, formatDate } from '../../utils/calculateAge';

async function fetchImageBuffer(url: string): Promise<Uint8Array | null> {
  try {
    if (url.startsWith('data:image/')) {
      const base64Data = url.split(',')[1];
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    }

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (err) {
    console.warn('Could not load image for docx export:', err);
    return null;
  }
}

export async function exportBiodataToDocx(
  biodata: BiodataDocument,
  filename?: string,
  onProgress?: (progress: number, stage: string) => void
): Promise<void> {
  onProgress?.(10, 'Compiling document structure...');

  const { title, sections, styling, photoUrl } = biodata;
  const primaryHex = styling.primaryColor.replace('#', '') || '881337';
  const accentHex = styling.accentColor.replace('#', '') || 'D97706';

  let imageBuffer: Uint8Array | null = null;
  if (styling.showPhoto && photoUrl) {
    onProgress?.(25, 'Processing profile photograph...');
    imageBuffer = await fetchImageBuffer(photoUrl);
  }

  onProgress?.(45, 'Creating Word typography and tables...');

  const docChildren: any[] = [];

  // Top Title
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'BIODATA',
          bold: true,
          size: 32, // 16pt
          color: primaryHex,
          font: 'Calibri',
        }),
      ],
    })
  );

  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 24, // 12pt
          color: accentHex,
          font: 'Calibri',
        }),
      ],
    })
  );

  // Profile Image if available
  if (imageBuffer) {
    try {
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
          children: [
            new ImageRun({
              data: imageBuffer,
              transformation: {
                width: 140,
                height: 180,
              },
              type: 'jpg',
            }),
          ],
        })
      );
    } catch (e) {
      console.warn('Failed to embed ImageRun into docx:', e);
    }
  }

  // Iterate over visible sections
  const visibleSections = sections.filter((s) => s.visible);

  for (const section of visibleSections) {
    const visibleFields = section.fields.filter((f) => f.visible);
    if (visibleFields.length === 0) continue;

    // Section Heading Paragraph
    docChildren.push(
      new Paragraph({
        spacing: { before: 300, after: 150 },
        border: {
          bottom: {
            color: accentHex,
            space: 4,
            style: BorderStyle.SINGLE,
            size: 12,
          },
        },
        children: [
          new TextRun({
            text: section.title.toUpperCase(),
            bold: true,
            size: 24,
            color: primaryHex,
            font: 'Calibri',
          }),
        ],
      })
    );

    // Build Table for section fields
    const tableRows: TableRow[] = [];

    for (const field of visibleFields) {
      const isDob = field.id.includes('dob') || field.label.toLowerCase().includes('date of birth');
      const calculatedAge = isDob ? calculateAge(field.value) : null;
      let displayValue = field.type === 'date' ? formatDate(field.value) : field.value || '—';
      if (calculatedAge !== null) {
        displayValue += ` (${calculatedAge} Years)`;
      }

      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: 35, type: WidthType.PERCENTAGE },
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.DASHED, size: 4, color: 'E2E8F0' },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: field.label,
                      bold: true,
                      size: 20,
                      color: '334155',
                      font: 'Calibri',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 65, type: WidthType.PERCENTAGE },
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.DASHED, size: 4, color: 'E2E8F0' },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: displayValue,
                      size: 20,
                      color: '1E293B',
                      font: 'Calibri',
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
      );
    }

    docChildren.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: tableRows,
      })
    );
  }

  // Footer note
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
      children: [
        new TextRun({
          text: 'Document created with Biodata Maker',
          italics: true,
          size: 16,
          color: '94A3B8',
          font: 'Calibri',
        }),
      ],
    })
  );

  onProgress?.(80, 'Packaging DOCX file...');

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              bottom: 1000,
              left: 1000,
              right: 1000,
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const outFilename = filename || `${biodata.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.docx`;

  onProgress?.(95, 'Downloading file...');
  saveAs(blob, outFilename.endsWith('.docx') ? outFilename : `${outFilename}.docx`);
  onProgress?.(100, 'Complete!');
}
