import * as React from "react";
import { useState } from "react";
import { fetchDefinitions } from "./api/api";
import "./App.css";

interface Definition {
  word: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{ definition: string }>;
  }>;
}

function App() {
  const [word, setWord] = useState<string>("");
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [isLight, setIsLight] = useState<boolean>(true);
  const [font, setFont] = useState<string>("Serif");

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFont(e.target.value);
  };

  const fontStyles: React.CSSProperties = {
    fontFamily: font,
  };

  const handleWordSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (word.trim() === "") {
      return;
    }
    try {
      const res = await fetchDefinitions(word);
      setDefinitions(res);
    } catch (error) {
      console.log(error);
      setDefinitions([]);
    }
  };

  return (
    <main>
      <header>
        <nav>
          
        </nav>
      </header>
      <section>
        <form onSubmit={handleWordSearch}></form>
      </section>
    </main>
  );
}

export default App;
