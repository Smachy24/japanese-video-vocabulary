type DictEntry = [kanji: string, reading: string, pos: string, sense: string, misc: string, meanings: Array<string>];

interface DictionaryResult {
  meanings: Array<string>;
  reading: string;
}

const TERM_BANK_COUNT = 3;

let dictionaryPromise: Promise<Map<string, DictionaryResult>> | null = null;

async function loadDictionary(): Promise<Map<string, DictionaryResult>> {
  const map = new Map<string, DictionaryResult>();

  const fetches = Array.from({ length: TERM_BANK_COUNT }, (_, index) =>
    fetch(`/dict/jmdict/french/term_bank_${index + 1}.json`).then(
      (response) => response.json() as Promise<Array<DictEntry>>
    )
  );

  const banks = await Promise.all(fetches);

  for (const entries of banks) {
    for (const [kanji, reading, , , , meanings] of entries) {
      if (!map.has(kanji)) {
        map.set(kanji, {
          meanings,
          reading,
        });
      }
    }
  }

  return map;
}

function getDictionary(): Promise<Map<string, DictionaryResult>> {
  if (!dictionaryPromise) {
    dictionaryPromise = loadDictionary();
  }
  return dictionaryPromise;
}

export async function getDictionaryInfo(lemma: string): Promise<{ meanings: Array<string>; reading: string } | undefined> {
  const dict = await getDictionary();
  return dict.get(lemma);
}
