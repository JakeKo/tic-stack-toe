import { useEffect, useState } from "react";
import "./App.css";

function GameStats({
  playerAName,
  playerBName,
  playerAWins,
  playerBWins,
  draws,
}) {
  const [columns, setColumns] = useState("");

  useEffect(() => {
    const gameCount = playerAWins + playerBWins + draws;
    setColumns(
      `${playerAWins / gameCount}fr ${draws / gameCount}fr ${
        playerBWins / gameCount
      }fr`
    );
  }, [playerAWins, playerBWins, draws]);

  return (
    <div className="game-stats">
      <div className="player-names">
        <div>{playerAName}</div>
        <div>{playerBName}</div>
      </div>
      <div className="win-stats" style={{ gridTemplateColumns: columns }}>
        <div className="player-a-wins">{playerAWins}</div>
        <div className="draws">{draws}</div>
        <div className="player-b-wins">{playerBWins}</div>
      </div>
    </div>
  );
}

export default GameStats;
