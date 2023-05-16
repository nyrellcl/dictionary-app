import * as React from "react";
import { useState } from "react";
import { fetchDefinitions } from "./api/api";
import logo from "./assets/images/logo.svg";
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

  const handleModeSwitch = () => {
    setIsLight(!isLight);
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
    <main>
      <header>
        <nav>
          <div className="logo">
            <a href="/">
              <img src={logo} alt="" />
            </a>
          </div>

          <select
            value={font}
            onChange={handleFontChange}
            name="font-select"
            id="FONTS"
            className="font-selection"
          >
            <option value="serif">Serif</option>
            <option value="monospace">Mono</option>
            <option value="sans-serif">Sans Serif</option>
          </select>
        </nav>

        {isLight ? (
          <div className="switch-container">
            <input
              type="radio"
              name="switch"
              id="switch"
              onClick={handleModeSwitch}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 22 22"
            >
              <path
                fill="none"
                stroke="#838383"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M1 10.449a10.544 10.544 0 0 0 19.993 4.686C11.544 15.135 6.858 10.448 6.858 1A10.545 10.545 0 0 0 1 10.449Z"
              />
            </svg>
          </div>
        ) : (
          <div className="switch-container">
            <input
              type="radio"
              name="switch"
              id="switch"
              onClick={handleModeSwitch}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 22 22"
            >
              <path
                fill="none"
                stroke="#a445ed"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M1 10.449a10.544 10.544 0 0 0 19.993 4.686C11.544 15.135 6.858 10.448 6.858 1A10.545 10.545 0 0 0 1 10.449Z"
              />
            </svg>
          </div>
        )}
      </header>
      <section>
        <form onSubmit={handleWordSearch}></form>
      </section>
    </main>
  );
}

export default App;
