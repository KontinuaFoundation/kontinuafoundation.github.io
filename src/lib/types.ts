export interface VideoRef {
  url: string;
  title: string;
}

export interface Topic {
  id: string;
  desc: string;
  videos: VideoRef[];
  references: VideoRef[];
}

export interface ChapterFile {
  path: string;
  desc: string;
  link: string;
}

export interface Chapter {
  id: string;
  title: string;
  chap_num: number;
  files: ChapterFile[];
  requires: string[];
  covers: Topic[];
}

export interface Workbook {
  num: string;
  title: string;
  pdf: string;
  chapters: Chapter[];
}

export interface TopicMeta {
  workbookNum: string;
  chapterNum: number;
  chapterTitle: string;
  desc: string;
}
