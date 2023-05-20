import * as React from "react";
import { useState } from "react";
import { Switch } from "@mui/material";
import { fetchDefinitions } from "./api/api";
import logo from "./assets/images/logo.svg";
import searchIcon from "./assets/images/icon-search.svg";

interface Definition {
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

  const handleModeSwitch = () => {
    setIsLight(!isLight);
    const getHTMLElement: HTMLHtmlElement | null =
      document.querySelector("html");
    if (getHTMLElement && isLight) {
      getHTMLElement.classList.toggle("dark-bg");
    }
    console.log("switch");
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
    <main style={fontStyles}>
      <header>
        <nav className="nav-bar">
          <div className="logo">
            <a href="/">
              <img src={logo} alt="" />
            </a>
          </div>

          <fieldset className="state-selections">
            <label htmlFor="font-select">{font}</label>
            <select
              value={font}
              onChange={handleFontChange}
              name="font-select"
              id="FONTS"
              className="font-selection"
            >
              <option value="Serif">Serif</option>
              <option value="Monospace">Mono</option>
              <option value="Sans-serif">Sans Serif</option>
            </select>
            {isLight ? (
              <div className="switch-container">
                <Switch onClick={handleModeSwitch} />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                >
                  <path
                    fill="none"
                    stroke="#838383"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M1 10.449a10.544 10.544 0 0 0 19.993 4.686C11.544 15.135 6.858 10.448 6.858 1A10.545 10.545 0 0 0 1 10.449Z"
                  />
                </svg>
              </div>
            ) : (
              <div className="switch-container">
                <Switch onClick={handleModeSwitch} />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                >
                  <path
                    fill="none"
                    stroke="#a445ed"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M1 10.449a10.544 10.544 0 0 0 19.993 4.686C11.544 15.135 6.858 10.448 6.858 1A10.545 10.545 0 0 0 1 10.449Z"
                  />
                </svg>
              </div>
            )}
          </fieldset>
        </nav>
      </header>
      <section className="definitions-container">
        <form
          onSubmit={handleWordSearch}
          method="POST"
          className="form-container"
        >
          <input
            name="search-word"
            id="search-word"
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Search for any word..."
          />

          <button type="submit" className="search-btn">
            <img src={searchIcon} alt="search-icon" />
          </button>
        </form>

        {definitions.length > 0 ? (
          <div>
            <article className="word-pronunciation">
              <div className="word-pronunciation__container">
                <h2 className="word-pronunciation__container__term">
                  {definitions[0].word}
                </h2>
                <span className="word-pronunciation__container__phonetics">
                  {definitions[0].phonetics[0].text}
                </span>
              </div>
              <div className="word-pronunciation__audio">
                <button type="button">Play</button>
              </div>
            </article>

            {definitions.map((definition, index) => (
              <>
                <article className="noun-container" key={index}>
                  <h3>
                    {definition.meanings[0].partOfSpeech}{" "}
                    <span className="line" />
                  </h3>
                  <small>Meaning</small>
                  <ul className="noun-container__list">
                    {definition.meanings[0].definitions.map((item, index) => (
                      <li key={index}>{item.definition}</li>
                    ))}
                  </ul>
                  <article className="synonym-container">
                    <p>
                      Synonyms{" "}
                      {definition.meanings[0].definitions[0].synonyms.map(
                        (syn, synIndex) => (
                          <span key={synIndex}>{syn}</span>
                        )
                      )}
                    </p>
                  </article>
                </article>
                <article
                  className="verb-container"
                  key={definition.meanings[1].partOfSpeech}
                >
                  <h3>
                    {definition.meanings[1].partOfSpeech}{" "}
                    <span className="line" />
                  </h3>
                  <small>Meaning</small>
                  <ul className="verb-container__list">
                    {definition.meanings[1].definitions.map((items, index) => (
                      <li key={index}>{items.definition}</li>
                    ))}
                  </ul>

                  <article className="example-container">
                    <q>{definition.meanings[1].definitions[0].example}</q>
                  </article>
                </article>
                <footer className="footer-container">
                  <p>
                    Source{" "}
                    <a href={`https://en.wiktionary.org/wiki/${word}`}>
                      https://en.wiktionary.org/wiki/{word}
                    </a>
                  </p>
                </footer>
              </>
            ))}
          </div>
        ) : (
          <p>Enter a word to search.</p>
        )}
      </section>
    </main>
  );
}

export default App;
