/**
 * Parses user input or clipboard text that may contain newlines, commas,
 * semicolons, bullet points, or numbering, and cleans it into single clean items.
 */
export function parsePastedList(text: string): string[] {
  if (!text) return [];

  // Normalize line breaks
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Check if string has multiple lines
  const rawLines = normalized.split("\n");
  const items: string[] = [];

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // If a line contains commas or semicolons (e.g. "React, TypeScript, Node.js"), split those too
    if (trimmed.includes(",") || trimmed.includes(";")) {
      const parts = trimmed.split(/[,;]+/);
      for (const part of parts) {
        const cleaned = cleanItemString(part);
        if (cleaned) items.push(cleaned);
      }
    } else {
      const cleaned = cleanItemString(trimmed);
      if (cleaned) items.push(cleaned);
    }
  }

  return items;
}

/**
 * Parses user input or clipboard text specifically for bullet points.
 * Splits by newlines and removes bullet/numbered prefixes, but keeps internal
 * commas and clauses intact.
 */
export function parsePastedBullets(text: string): string[] {
  if (!text) return [];
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rawLines = normalized.split("\n");
  const bullets: string[] = [];
  for (const line of rawLines) {
    const cleaned = cleanItemString(line);
    if (cleaned) bullets.push(cleaned);
  }
  return bullets;
}

/**
 * Strips leading bullets (•, -, *, ⁃, etc.), list numbers (1., 1), etc.), and quotes.
 */
export function cleanItemString(val: string): string {
  return val
    // Remove leading bullet characters
    .replace(/^[\s•\-\*\u2022\u2023\u25E6\u2043\u2219▪►✓✔]+\s*/, "")
    // Remove leading list numbers: "1.", "1)", "(1)", "1 - "
    .replace(/^\(?\d+[\.\)\-]\s*/, "")
    // Remove surrounding quotes
    .replace(/^["'“”]+|["'“”]+$/g, "")
    .trim();
}
