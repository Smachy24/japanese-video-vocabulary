import { describe, expect, it, vi } from "vitest";
import { JlptLevel, type Token } from "../../src/types/token";
import { analyzeSentence } from "../../src/features/analysis/analysis-pipeline";
import { parseSrt } from "../../src/features/analysis/subtitles-parser";
import type { SrtEntry } from "../../src/types/subtitle";

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
    const tokens = await analyzeSentence("食べる");
    const expectedToken: Token = {
      surface: "食べる",
      lemma: "食べる",
      pos: "動詞",
      readingSurfaceKatakana: "タベル",
      readingSurfaceHiragana: "たべる",
      readingLemma: "たべる",
      meanings: ["manger"],
      jlpt: JlptLevel.N5,
    };

    expect(tokens).toHaveLength(1);
    expect(tokens[0]).toEqual(expectedToken);
  });
});


describe("subtitle-parser", () => {
  it("should parse a simple SRT string", () => {
    const input = [
      "3",
      "00:00:08,718 --> 00:00:12,179",
      "今日は学校へ行きます",
      "",
    ].join("\n");

    const result = parseSrt(input);
    const expectedResult: Array<SrtEntry> = [
      {
        startTime: 8.718,
        endTime: 12.179,
        text: "今日は学校へ行きます",
      },
    ];

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(expectedResult[0]);
  });

  it("should parse multi-line subtitle text", () => {
    const input = [
      "4",
      "00:00:16,308 --> 00:00:19,562",
      "（片桐）永遠のライバル",
      "大空翼(おおぞら つばさ)と日向小次郎(ひゅうが こじろう)",
      "",
    ].join("\n");

    const result = parseSrt(input);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      startTime: 16.308,
      endTime: 19.562,
      text: "（片桐）永遠のライバル\n大空翼(おおぞら つばさ)と日向小次郎(ひゅうが こじろう)",
    });
  });

  it("should handle leading space before text", () => {
    const input = [
      "5",
      "00:00:20,312 --> 00:00:22,523",
      " （片桐）そして 選ばれし選手たち",
      "",
    ].join("\n");

    const result = parseSrt(input);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      startTime: 20.312,
      endTime: 22.523,
      text: "（片桐）そして 選ばれし選手たち",
    });
  });
});