import type { Workbook } from "./types";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export function dedupByUrl<T extends { url: string }>(arr: T[]): T[] {
  const seen = new Set<string>();

  return arr.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

export function dedupStrings(arr: string[]): string[] {
  return [...new Set(arr)];
}

export async function getPdfPageCount(url: string): Promise<number> {
  const pdf = await pdfjsLib.getDocument(url).promise;
  return pdf.numPages;
}


export async function loadPageCounts(workbook: Workbook) {
  const chapterEntries = await Promise.all(
    workbook.chapters.map(async (chapter) => {
      try {
        const pages = await getPdfPageCount(`${chapter.id}.pdf`);
        return [chapter.id, pages] as const;
      } catch {
        return [chapter.id, 0] as const;
      }
    }),
  );

  let workbookPages: number | null;

  try {
    workbookPages = await getPdfPageCount(workbook.pdf);
  } catch {
    workbookPages = null;
  }

  return {
    chapterPages: Object.fromEntries(chapterEntries),
    workbookPages
  };
}