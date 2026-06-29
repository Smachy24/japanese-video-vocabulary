export interface Token {
  surface: string;
  lemma: string;
  pos: string;
  readingSurfaceKatakana?: string; // Kuromoji source (katakana)
  readingSurfaceHiragana?: string;
  readingLemma?: string; // Jmdict source (hiragana)
  meanings?: Array<string>;
  jlpt?: JlptLevel;
}



export enum JlptLevel {
  N5 = "N5",
  N4 = "N4",
  N3 = "N3",
  N2 = "N2",
  N1 = "N1",
}