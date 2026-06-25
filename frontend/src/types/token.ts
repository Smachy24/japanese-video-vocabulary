export interface Token {
  surface: string;
  lemma: string; // The base form of the word
  pos: string; // Part of speech (e.g., noun, verb, adjective)
  readingKatakana?: string;
  readingHiragana?: string;
}