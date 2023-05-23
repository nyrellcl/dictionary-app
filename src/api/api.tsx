interface Term {
  word: string;
  phonetics: Array<{
    text: string;
    audio: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      synonyms: string[];
      example: string;
    }>;
  }>;
}

export async function fetchDefinitions(
  word: string,
  language = "en"
): Promise<Term[]> {
  const apiURL = "https://api.dictionaryapi.dev/api/v2/entries";
  const params = new URLSearchParams({ language });

  try {
    const response = await fetch(`${apiURL}/${language}/${word}?${params}`);
    const data = await response.json();

    if (Array.isArray(data)) {
      return data;
    } else {
      return [];
    }
  } catch (error) {
    throw new Error("Failed to fetch definition of word");
  }
}
