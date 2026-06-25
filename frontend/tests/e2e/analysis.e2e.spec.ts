import { test, expect } from "@playwright/test";

test("tokenize a simple verb with the real dictionary", async ({ page }) => {
  await page.goto("/");

  const result = await page.evaluate(async () => {
    const { tokenize } = await import("../../src/features/analysis/tokenizer");
    return tokenize("食べる");
  });

  expect(result.text).toBe("食べる");
  expect(result.tokens).toHaveLength(1);
  expect(result.tokens[0]).toEqual({
    surface: "食べる",
    lemma: "食べる",
    pos: "動詞",
    readingKatakana: "タベル",
    readingHiragana: "たべる",
    meaning: ["manger"],
  });
});
