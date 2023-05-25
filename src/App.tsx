import * as React from "react";
import { useState, useEffect } from "react";
import { Switch } from "@mui/material";
import { DictionaryFacade } from "./api/api";
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
  const [word, setWord] = useState<string>("keyboard"); //change default state after challenge submission
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [isLight, setIsLight] = useState<boolean>(true);
  const [font, setFont] = useState<string>("Serif");
  const [inputError, setInputError] = useState<string>("");

  useEffect(() => {
    const fetchWordDefinitions = async () => {
      try {
        const dictionaryFacade = new DictionaryFacade()
        const res = await dictionaryFacade.fetchDefinitions(word)
        if (res.length === 0) {
          setInputError("No Definitions Found");
          setDefinitions([]);
        } else {
          setDefinitions(res);
        }
      } catch (error) {
        console.log(error);
        setDefinitions([]);
      }
    };
    fetchWordDefinitions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFont(e.target.value);
  };

  const fontStyles: React.CSSProperties = {
    fontFamily: font,
  };

  const handleAudioPlay = () => {
    //when clicked audio should play
    //extract audio object when user clicks on play button svg
    const audioEl = new Audio(definitions[0].phonetics[0].audio);
    audioEl.play();
  };

  const handleModeSwitch = () => {
    const getHTMLElement: HTMLHtmlElement | null =
      document.querySelector("html");

    if (getHTMLElement && isLight) {
      getHTMLElement.classList.toggle("dark-bg");
    } else {
      getHTMLElement?.classList.remove("dark-bg");
    }
    setIsLight((prevIsLight) => !prevIsLight);
  };

  const handleWordSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const inputRegEx = /^[a-zA-Z]+$/;

    if (word.trim() === "") {
      setInputError("Whoops, can't be empty...");
      setDefinitions([]);
    } else if (!inputRegEx.test(word)) {
      setInputError("Whoops, can't contain numbers...");
      setDefinitions([]);
    } else {
      setInputError("");
    }

    try {
      const newSearchesFacade = new DictionaryFacade()
      const res = await newSearchesFacade.fetchDefinitions(word);
      if (res.length === 0) {
        setInputError("No Definitions Found");
      } else {
        setDefinitions(res);
      }
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
            {/* <label
              htmlFor="font-select"
              className={isLight ? undefined : "label-dark"}
            >
              {font}
            </label> */}
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
          className={isLight ? "form-container" : "form-container search-dark"}
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
        {inputError ? <p className="error-message">{inputError}</p> : null}

        {definitions.length > 0 ? (
          <div>
            <article className="word-pronunciation">
              <div className="word-pronunciation__container">
                <h2
                  className={
                    isLight
                      ? "word-pronunciation__container__term"
                      : "word-pronunciation__container__term dark"
                  }
                >
                  {definitions[0].word}
                </h2>
                <span className="word-pronunciation__container__phonetics">
                  {definitions[0].phonetics[0].text}
                </span>
              </div>
              <div className="word-pronunciation__audio">
                {definitions[0].phonetics[0].audio ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="75"
                    height="75"
                    viewBox="0 0 75 75"
                    className="word-pronunciation__audio__btn"
                    onClick={handleAudioPlay}
                  >
                    <g fill="#A445ED" fillRule="evenodd">
                      <circle cx="37.5" cy="37.5" r="37.5" opacity=".25" />
                      <path d="M29 27v21l21-10.5z" />
                    </g>
                  </svg>
                ) : null}
              </div>
            </article>

            {definitions.map((definition, index) => (
              <>
                <section className="term-container" key={index}>
                  {definition.meanings.map((meaning, meaningIdx) => (
                    <article className="noun-container" key={meaningIdx}>
                      <h3 className={isLight ? undefined : "dark"}>
                        {meaning.partOfSpeech} <span className="line" />
                      </h3>
                      <small>Meaning</small>
                      <ul className="noun-container__list">
                        {meaning.definitions.map(
                          (meaningItem, meaningItemIdx) => (
                            <li
                              key={meaningItemIdx}
                              className={isLight ? undefined : "dark"}
                            >
                              {meaningItem.definition}
                            </li>
                          )
                        )}
                      </ul>
                      {meaning.definitions[0].example ? (
                        <q>{meaning.definitions[0].example}</q>
                      ) : null}

                      {meaning.definitions[0].synonyms.length > 0 ? (
                        <article className="synonym-container">
                          <p className={isLight ? undefined : "label-dark"}>
                            Synonyms:{" "}
                            {meaning.definitions[0].synonyms.map(
                              (syn, synIndex) => (
                                <span key={synIndex} className="label-accent">
                                  {syn}
                                </span>
                              )
                            )}
                          </p>
                        </article>
                      ) : null}
                    </article>
                  ))}
                </section>
                <footer className="footer-container">
                  <p className={isLight ? undefined : "label-dark"}>
                    Source:{" "}
                    <a
                      href={`https://en.wiktionary.org/wiki/${word}`}
                      className={isLight ? undefined : "label-dark"}
                    >
                      https://en.wiktionary.org/wiki/{word}
                    </a>
                    <span style={{ marginLeft: "1rem" }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                      >
                        <path
                          fill="none"
                          stroke="#838383"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M6.09 3.545H2.456A1.455 1.455 0 0 0 1 5v6.545A1.455 1.455 0 0 0 2.455 13H9a1.455 1.455 0 0 0 1.455-1.455V7.91m-5.091.727 7.272-7.272m0 0H9m3.636 0V5"
                        />
                      </svg>
                    </span>
                  </p>
                </footer>
              </>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default App;
