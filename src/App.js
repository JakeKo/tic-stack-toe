import { useEffect } from "react";
import "./app.css";
import { playGame } from "./runner";

function App() {
  useEffect(() => {
    const gameCount = 10;
    const wins = [];

    for (let i = 0; i < gameCount; i++) {
      wins.push(playGame());
    }

    console.log(wins);
  }, []);

  return <div className="app">Hello World!</div>;
}

export default App;
