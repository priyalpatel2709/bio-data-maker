import { useState, useEffect, RefObject } from 'react';

export type PaperSize = 'a4' | 'letter';

export interface PageMetrics {
  nominalPageWidthPx: number;
  nominalPageHeightPx: number;
  contentHeightPx: number;
  isOverflowing: boolean;
  overflowPx: number;
  estimatedLinesOver: number;
  fillPercentage: number;
  pageCount: number;
}

/**
 * Calculates page dimensions based on standard 96 DPI CSS pixels:
 * A4: 210mm x 297mm -> 793.7px x 1122.5px (~794px x 1123px)
 * US Letter: 8.5in x 11in -> 816px x 1056px
 */
export function getNominalDimensions(paperSize: PaperSize = 'a4') {
  if (paperSize === 'letter') {
    return {
      nominalPageWidthPx: 816,
      nominalPageHeightPx: 1056,
      aspectRatio: 8.5 / 11,
    };
  }
  return {
    nominalPageWidthPx: 794,
    nominalPageHeightPx: 1123,
    aspectRatio: 210 / 297,
  };
}

/**
 * React hook that measures actual DOM height of the target page sheet and
 * detects whether content overflows past the standard single page boundary.
 */
export function usePageMetrics(
  elementRef: RefObject<HTMLElement | null>,
  paperSize: PaperSize = 'a4'
): PageMetrics {
  const { nominalPageWidthPx, nominalPageHeightPx } = getNominalDimensions(paperSize);

  const [metrics, setMetrics] = useState<PageMetrics>({
    nominalPageWidthPx,
    nominalPageHeightPx,
    contentHeightPx: nominalPageHeightPx,
    isOverflowing: false,
    overflowPx: 0,
    estimatedLinesOver: 0,
    fillPercentage: 100,
    pageCount: 1,
  });

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const measure = () => {
      // Find the primary page-1 container or use the target element itself
      const page1 = el.querySelector('#resume-page-1') as HTMLElement || el;
      const scrollH = page1.scrollHeight || page1.offsetHeight;

      // Allow 4px margin of tolerance for sub-pixel anti-aliasing
      const overflow = Math.max(0, scrollH - nominalPageHeightPx);
      const isOver = overflow > 6;
      // Average line height is roughly 20-22px
      const linesOver = isOver ? Math.ceil(overflow / 22) : 0;
      const fill = Math.min(100, Math.round((scrollH / nominalPageHeightPx) * 100));

      const totalH = el.scrollHeight || el.offsetHeight;
      const pages = Math.max(1, Math.ceil(totalH / (nominalPageHeightPx - 10)));

      setMetrics({
        nominalPageWidthPx,
        nominalPageHeightPx,
        contentHeightPx: scrollH,
        isOverflowing: isOver,
        overflowPx: overflow,
        estimatedLinesOver: linesOver,
        fillPercentage: fill,
        pageCount: pages,
      });
    };

    measure();

    const observer = new ResizeObserver(() => {
      measure();
    });

    observer.observe(el);
    const page1 = el.querySelector('#resume-page-1');
    if (page1) observer.observe(page1);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, paperSize, nominalPageWidthPx, nominalPageHeightPx]);

  return metrics;
}
