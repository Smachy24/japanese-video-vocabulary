type DictEntry = [string, string, string, string, number, Array<string>, number, string];

interface DictionaryResult {
  meanings: Array<string>;
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
    for (const [kanji, , , , , meanings] of entries) {
      if (!map.has(kanji)) {
        map.set(kanji, { meanings });
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

export async function lookupMeaning(lemma: string): Promise<Array<string> | undefined> {
  const dict = await getDictionary();
  return dict.get(lemma)?.meanings;
}
