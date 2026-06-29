import { JpltLevel } from "../../types/token";

type JlptEntry = [string, string, { reading: string; frequency: { value: number; displayValue: string } }];

const FILE_COUNT = 5;
const LEVEL_MAP = new Map<number, JpltLevel>([
  [1, JpltLevel.N1],
  [2, JpltLevel.N2],
  [3, JpltLevel.N3],
  [4, JpltLevel.N4],
  [5, JpltLevel.N5],
]);

let jlptPromise: Promise<Map<string, JpltLevel>> | null = null;

async function loadJlpt(): Promise<Map<string, JpltLevel>> {
  const map = new Map<string, JpltLevel>();

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

function getJlptMap(): Promise<Map<string, JpltLevel>> {
  if (!jlptPromise) {
    jlptPromise = loadJlpt();
  }
  return jlptPromise;
}

export async function lookupJlpt(lemma: string): Promise<JpltLevel | undefined> {
  const map = await getJlptMap();
  return map.get(lemma);
}
