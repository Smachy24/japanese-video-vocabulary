// eslint-disable-next-line unicorn/prevent-abbreviations
export const isProduction = import.meta.env.MODE === "production";

export function katakanaToHiragana(input: string): string {
  return input.replace(/[\u30A1-\u30F6]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0x60)
  );
}