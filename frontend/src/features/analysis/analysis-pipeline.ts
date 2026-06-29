import type { SentenceAnalysis } from "../../types/sentence-analysis";
import { getTokensDictionaryInfo } from "./dictionary";
import { getTokensJlptLevel } from "./jlpt-parser";
import { tokenize } from "./tokenizer";


// Global pipeline function to analyze a sentence and return the analysis result
export async function analyzeSentence(text: string): Promise<SentenceAnalysis> {
  let tokens = await tokenize(text);
  tokens = await getTokensDictionaryInfo(tokens);
  tokens = await getTokensJlptLevel(tokens);

  return {
    text,
    tokens,
  };
}