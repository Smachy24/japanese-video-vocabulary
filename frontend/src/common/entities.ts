import type { SubtitleAnalysis } from "../types/subtitle";

export interface SubtitleFile {
  id?: number;
  fileName: string;
  analyses: Array<SubtitleAnalysis>;
}