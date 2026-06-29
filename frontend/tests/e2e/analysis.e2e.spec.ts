import { test, expect } from "@playwright/test";

test("full analysis with a simple verb successful", async ({ page }) => {
  await page.goto("/");

  const expectedToken = {
    surface: "食べる",
    lemma: "食べる",
    pos: "動詞",
    readingSurfaceKatakana: "タベル",
    readingSurfaceHiragana: "たべる",
    readingLemma: "たべる",
    meanings: ["manger"],
    jlpt: "N5",
  };

  const result = await page.evaluate(async () => {
    const { analyzeSentence } = await import("../../src/features/analysis/analysis-pipeline");
    return analyzeSentence("食べる");
  });

  expect(result).toHaveLength(1);
  expect(result[0]).toEqual(expectedToken);
});

test("analyzeSubtitles with a simple sentence", async ({ page }) => {
  await page.goto("/");

  const result = await page.evaluate(async () => {
    const { analyzeSubtitles } = await import("../../src/features/analysis/analysis-pipeline");
    const srt = "1\n00:00:01,000 --> 00:00:03,000\n今日は学校へ行きます\n";
    return analyzeSubtitles(srt);
  });

  expect(result).toHaveLength(1);
  expect(result[0]!.startTime).toBe(1);
  expect(result[0]!.endTime).toBe(3);
  expect(result[0]!.text).toBe("今日は学校へ行きます");
  expect(result[0]!.tokens).toHaveLength(6);

  expect(result[0]!.tokens[0]).toEqual({
    surface: "今日",
    lemma: "今日",
    pos: "名詞",
    readingSurfaceKatakana: "キョウ",
    readingSurfaceHiragana: "きょう",
    meanings: ["aujourd'hui", "ce jour"],
    readingLemma: "きょう",
    jlpt: "N3",
  });

  expect(result[0]!.tokens[1]).toEqual({
    surface: "は",
    lemma: "は",
    pos: "助詞",
    readingSurfaceKatakana: "ハ",
    readingSurfaceHiragana: "は",
    meanings: ["oui", "en effet", "bien"],
    readingLemma: "は",
  });

  expect(result[0]!.tokens[2]).toEqual({
    surface: "学校",
    lemma: "学校",
    pos: "名詞",
    readingSurfaceKatakana: "ガッコウ",
    readingSurfaceHiragana: "がっこう",
    meanings: ["école"],
    readingLemma: "がっこう",
    jlpt: "N5",
  });

  expect(result[0]!.tokens[3]).toEqual({
    surface: "へ",
    lemma: "へ",
    pos: "助詞",
    readingSurfaceKatakana: "ヘ",
    readingSurfaceHiragana: "へ",
  });

  expect(result[0]!.tokens[4]).toEqual({
    surface: "行き",
    lemma: "行く",
    pos: "動詞",
    readingSurfaceKatakana: "イキ",
    readingSurfaceHiragana: "いき",
    meanings: ["aller"],
    readingLemma: "いく",
    jlpt: "N5",
  });

  expect(result[0]!.tokens[5]).toEqual({
    surface: "ます",
    lemma: "ます",
    pos: "助動詞",
    readingSurfaceKatakana: "マス",
    readingSurfaceHiragana: "ます",
  });
});