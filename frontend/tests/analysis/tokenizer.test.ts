import { describe, expect, it, vi } from "vitest";
import { tokenize } from "../../src/features/analysis/tokenizer";
import { SentenceAnalysis } from "../../src/types/sentence-analysis";

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


describe("tokenize", () => {
  it("should tokenize a simple verb", async () => {
    const sentenceAnalysis = await tokenize("食べる");
    const expectedResult: SentenceAnalysis = {
      text: "食べる",
      tokens: [
        {
          surface: "食べる",
          lemma: "食べる",
          pos: "動詞",
          readingKatakana: "タベル",
          readingHiragana: "たべる",
        },
      ],
    };

    expect(sentenceAnalysis.tokens).toHaveLength(1);
    expect(sentenceAnalysis.tokens[0]).toEqual(expectedResult.tokens[0]);
  });
});
