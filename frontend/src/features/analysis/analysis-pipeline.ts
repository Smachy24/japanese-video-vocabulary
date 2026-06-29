import type { SubtitleAnalysis } from "../../types/subtitle";
import type { Token } from "../../types/token";
import { getTokensDictionaryInfo } from "./dictionary";
import { getTokensJlptLevel } from "./jlpt-parser";
import { parseSrt } from "./subtitles-parser";
import { tokenize } from "./tokenizer";


// Global pipeline function to analyze a sentence and return the analysis result
export async function analyzeSentence(text: string): Promise<Array<Token>> {
  let tokens = await tokenize(text);
  tokens = await getTokensDictionaryInfo(tokens);
  tokens = await getTokensJlptLevel(tokens);

  return tokens;
}

export async function analyzeSubtitles(srt: string): Promise<Array<SubtitleAnalysis>> {
  const entries = parseSrt(srt);
  const analyses: Array<SubtitleAnalysis> = await Promise.all(
    entries.map(async (entry): Promise<SubtitleAnalysis> => {
      const tokens = await analyzeSentence(entry.text);
      return {
        startTime: entry.startTime,
        endTime: entry.endTime,
        text: entry.text,
        tokens,
      };
    }   
  ));
  return analyses;
}