import { test, expect } from "@playwright/test";

test("full analysis with a simple verb successful", async ({ page }) => {
  await page.goto("/");

  const expectedResult = {
    text: "食べる",
    tokens: [
      {
        surface: "食べる",
        lemma: "食べる",
        pos: "動詞",
        readingSurfaceKatakana: "タベル",
        readingSurfaceHiragana: "たべる",
        readingLemma: "たべる",
        meaning: ["manger"],
        jlpt: "N5",
      },
    ],
  };

  const result = await page.evaluate(async () => {
    const { tokenize } = await import("../../src/features/analysis/tokenizer");
    return tokenize("食べる");
  });

  expect(result.text).toBe("食べる");
  expect(result.tokens).toHaveLength(1);
  expect(result.tokens[0]).toEqual(expectedResult.tokens[0]);
});