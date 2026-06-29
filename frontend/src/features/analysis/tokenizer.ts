import { type LoaderConfig, TokenizerBuilder } from "@patdx/kuromoji";
import type { SentenceAnalysis } from "../../types/sentence-analysis";
import { katakanaToHiragana } from "../../common/utils";
import { getDictionaryInfo } from "./dictionary";
import { lookupJlpt } from "./jlpt-parser";
import type { Token } from "../../types/token";

const loader: LoaderConfig = {
  async loadArrayBuffer(url: string) {
    url = url.replace(".gz", "");

    const response = await fetch(`/dict/tokenizer/${url}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch dictionary file: ${url}`);
    }

    return response.arrayBuffer();
  },
};

const tokenizerPromise = new TokenizerBuilder({
  loader,
}).build();

export async function tokenize(text: string): Promise<SentenceAnalysis> {
  const tokenizer = await tokenizerPromise;

  const rawTokens = tokenizer.tokenize(text);

  const tokens: Array<Token> = await Promise.all(
    rawTokens.map(async (t) => {
      const dictionaryInfo = await getDictionaryInfo(t.basic_form);
      const jlpt = await lookupJlpt(t.basic_form);
      return {
        surface: t.surface_form,
        lemma: t.basic_form,
        pos: t.pos,
        readingSurfaceKatakana: t.reading,
        readingSurfaceHiragana: t.reading ? katakanaToHiragana(t.reading) : undefined,
        readingLemma: t.basic_form ? dictionaryInfo?.reading : undefined,
        meaning: t.basic_form ? dictionaryInfo?.meanings : undefined,
        jlpt,
      }
    })
  );

  return {
    text,
    tokens,
  }
}
