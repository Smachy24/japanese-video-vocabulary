import { type LoaderConfig, TokenizerBuilder } from "@patdx/kuromoji";
import { katakanaToHiragana } from "../../common/utils";
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

let tokenizerPromise: ReturnType<TokenizerBuilder["build"]> | null = null;

function getTokenizer() {
  if (!tokenizerPromise) {
    tokenizerPromise = new TokenizerBuilder({ loader }).build();
  }
  return tokenizerPromise;
}

// First pipeline step : tokenize
export async function tokenize(text: string): Promise<Array<Token>> {
  const tokenizer = await getTokenizer();

  const rawTokens = tokenizer.tokenize(text);

  const tokens = rawTokens.map((t) => {
    // Unknown words have a basic_form of "*", so we use the surface_form in that case
    const lemma = t.basic_form !== "*" ? t.basic_form : t.surface_form;
    return {
      surface: t.surface_form,
      lemma,
      pos: t.pos,
      readingSurfaceKatakana: t.reading,
      readingSurfaceHiragana: t.reading ? katakanaToHiragana(t.reading) : undefined,
    };
  });

  return tokens;
}