import type { Token } from "./token";

export interface SentenceAnalysis {
  text: string;
  tokens: Array<Token>;
}