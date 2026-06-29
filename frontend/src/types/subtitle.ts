import type { Token } from "./token";

export interface SrtEntry {
  startTime: number;
  endTime: number;
  text: string;
}

export interface SubtitleAnalysis {
  startTime: number;
  endTime: number;
  text: string;
  tokens: Array<Token>;
}