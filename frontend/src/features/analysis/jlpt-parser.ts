import { JlptLevel, type Token } from "../../types/token";

type JlptEntry = [string, string, { reading: string; frequency: { value: number; displayValue: string } }];

const FILE_COUNT = 5;
const LEVEL_MAP = new Map<number, JlptLevel>([
  [1, JlptLevel.N1],
  [2, JlptLevel.N2],
  [3, JlptLevel.N3],
  [4, JlptLevel.N4],
  [5, JlptLevel.N5],
]);

let jlptPromise: Promise<Map<string, JlptLevel>> | null = null;

async function loadJlpt(): Promise<Map<string, JlptLevel>> {
  const map = new Map<string, JlptLevel>();

  const fetches = Array.from({ length: FILE_COUNT }, (_, index) => {
    const fileNumber = index + 1;
    return fetch(`/dict/jlpt/term_meta_bank_${fileNumber}.json`)
      .then((response) => response.json() as Promise<Array<JlptEntry>>)
      .then((entries) => ({ entries, level: LEVEL_MAP.get(fileNumber)! }));
  });

  const banks = await Promise.all(fetches);

  for (const { entries, level } of banks) {
    for (const [kanji] of entries) {
      if (!map.has(kanji)) {
        map.set(kanji, level);
      }
    }
  }

  return map;
}

function getJlptMap(): Promise<Map<string, JlptLevel>> {
  if (!jlptPromise) {
    jlptPromise = loadJlpt();
  }
  return jlptPromise;
}


// Third pipeline step : get JLPT level
export async function getTokensJlptLevel(tokens: Array<Token>): Promise<Array<Token>> {
  const jlptMap = await getJlptMap();
  return tokens.map((token): Token => {
    const jlpt = jlptMap.get(token.lemma);
    return {
      ...token,
      jlpt,
    };
  });
}