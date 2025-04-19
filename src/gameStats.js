import { useEffect, useState } from "react";
import "./App.css";

function roundDecimal(num, digits = 3) {
  const multiple = Math.pow(10, digits);
  return Math.round(num * multiple) / multiple;
}

function GameStats({ p1Name, p2Name, p1Wins, p2Wins, draws }) {
  const [columns, setColumns] = useState("");
  const gameCount = p1Wins + p2Wins + draws;

  useEffect(() => {
    let p1WinWidth = 1,
      p2WinWidth = 1,
      drawWidth = 1;
    if (gameCount !== 0) {
      p1WinWidth = p1Wins / gameCount || 0;
      p2WinWidth = p2Wins / gameCount || 0;
      drawWidth = draws / gameCount || 0;
    }

    setColumns(`${p1WinWidth}fr ${drawWidth}fr ${p2WinWidth}fr`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p1Wins, p2Wins, draws]);

  return (
    <div className="game-stats">
      <div className="player-names">
        <div>{p1Name}</div>
        <div>{p2Name}</div>
      </div>
      <div className="win-stats" style={{ gridTemplateColumns: columns }}>
        <div className="player-a-wins">
          {p1Wins} ({roundDecimal(p1Wins / gameCount)})
        </div>
        <div className="draws">{draws}</div>
        <div className="player-b-wins">
          ({roundDecimal(p2Wins / gameCount)}) {p2Wins}
        </div>
      </div>
    </div>
  );
}

export default GameStats;
