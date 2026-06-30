import type { SubtitleAnalysis } from "../types/subtitle";

export interface SubtitleFile {
  id?: number;
  fileName: string;
  videoId?: number;
  analyses: Array<SubtitleAnalysis>;
}

export interface VideoFile {
  id?: number;
  name: string;
  data: ArrayBuffer;
  mimeType: string;
}
