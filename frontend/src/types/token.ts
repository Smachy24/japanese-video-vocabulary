export interface Token {
  surface: string;
  lemma: string;
  pos: string;
  readingKatakana?: string;
  readingHiragana?: string;
  meaning?: string[];
}