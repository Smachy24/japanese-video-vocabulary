import { type LoaderConfig, TokenizerBuilder } from "@patdx/kuromoji";
import type { SentenceAnalysis } from "../../types/sentence-analysis";
import { katakanaToHiragana } from "../../common/utils";
import { lookupMeaning } from "./dictionary";

const loader: LoaderConfig = {
  async loadArrayBuffer(url: string) {
    url = url.replace(".gz", "");

    const response = await fetch(`/dict/${url}`);

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

  const tokens = await Promise.all(
    rawTokens.map(async (t) => ({
      surface: t.surface_form,
      lemma: t.basic_form,
      pos: t.pos,
      readingKatakana: t.reading,
      readingHiragana: t.reading ? katakanaToHiragana(t.reading) : undefined,
      meaning: await lookupMeaning(t.basic_form),
    }))
  );

  return {
    text,
    tokens,
  }
}
