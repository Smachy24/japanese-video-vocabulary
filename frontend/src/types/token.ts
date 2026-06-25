export interface Token {
  surface: string;
  lemma: string;
  pos: string;
  readingSurfaceKatakana?: string; // Kuromoji source (katakana)
  readingSurfaceHiragana?: string;
  readingLemma?: string; // Jmdict source (hiragana)
  meaning?: Array<string>;
}