import { useEffect, useState } from "react";
import "./app.css";
import { playGame } from "./runner";
import GameStats from "./gameStats";

function App() {
  const [playerAWins, setPlayerAWins] = useState(0);
  const [playerBWins, setPlayerBWins] = useState(0);
  const [draws, setDraws] = useState(0);

  useEffect(() => {
    const gameCount = 10;
    let playerAWinsTemp = playerAWins;
    let playerBWinsTemp = playerBWins;
    let drawsTemp = draws;

    for (let i = 0; i < gameCount; i++) {
      const win = playGame();

      if (win === "a") {
        playerAWinsTemp++;
      } else if (win === "b") {
        playerBWinsTemp++;
      } else {
        drawsTemp++;
      }
    }

    setPlayerAWins(playerAWinsTemp);
    setPlayerBWins(playerBWinsTemp);
    setDraws(drawsTemp);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="app">
      Hello World!
      <GameStats
        playerAName={"A"}
        playerBName={"B"}
        playerAWins={playerAWins}
        playerBWins={playerBWins}
        draws={draws}
      />
    </div>
  );
}

export default App;
