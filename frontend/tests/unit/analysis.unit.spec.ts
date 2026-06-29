import { describe, expect, it, vi } from "vitest";
import { SentenceAnalysis } from "../../src/types/sentence-analysis";
import { JlptLevel } from "../../src/types/token";
import { analyzeSentence } from "../../src/features/analysis/analysis-pipeline";

vi.mock("@patdx/kuromoji", () => {
  const mockTokenizer = {
    tokenize: (text: string) => {
      if (text === "食べる") {
        return [
          {
            surface_form: "食べる",
            pos: "動詞",
            pos_detail_1: "自立",
            pos_detail_2: "*",
            pos_detail_3: "*",
            conjugated_type: "一段",
            conjugated_form: "基本形",
            basic_form: "食べる",
            reading: "タベル",
            pronunciation: "タベル",
          },
        ];
      }
      return [];
    },
  };

  return {
    TokenizerBuilder: class {
      build() {
        return Promise.resolve(mockTokenizer);
      }
    },
  };
});

vi.mock("../../src/features/analysis/dictionary", () => ({
  getTokensDictionaryInfo: async (tokens: Array<{ lemma: string }>) => {
    const dict: Record<string, { meanings: string[]; readingLemma: string }> = {
      "食べる": { meanings: ["manger"], readingLemma: "たべる" },
    };
    return tokens.map((token) => ({
      ...token,
      ...dict[token.lemma],
    }));
  },
}));

vi.mock("../../src/features/analysis/jlpt-parser", () => ({
  getTokensJlptLevel: async (tokens: Array<{ lemma: string }>) => {
    const dict: Record<string, JlptLevel> = {
      "食べる": JlptLevel.N5,
    };
    return tokens.map((token) => ({
      ...token,
      jlpt: dict[token.lemma],
    }));
  },
}));


describe("tokenize", () => {
  it("should tokenize a simple verb", async () => {
    const sentenceAnalysis = await analyzeSentence("食べる");
    const expectedResult: SentenceAnalysis = {
      text: "食べる",
      tokens: [
        {
          surface: "食べる",
          lemma: "食べる",
          pos: "動詞",
          readingSurfaceKatakana: "タベル",
          readingSurfaceHiragana: "たべる",
          readingLemma: "たべる",
          meanings: ["manger"],
          jlpt: JlptLevel.N5,
        },
      ],
    };

    expect(sentenceAnalysis.tokens).toHaveLength(1);
    expect(sentenceAnalysis.tokens[0]).toEqual(expectedResult.tokens[0]);
  });
});
