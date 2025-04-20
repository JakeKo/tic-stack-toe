import { useEffect, useState } from "react";
import "./App.css";
import GameStats from "./gameStats";
import { createBoard } from "./engine/board";
import { autoPlayGame } from "./engine/game";
import BoardDisplay from "./boardDisplay";

function usePlayerHistory() {
  const [wins, setWins] = useState(0);
  const [draws, setDraws] = useState(0);
  const [losses, setLosses] = useState(0);
  const [history, setHistory] = useState([]);

  function recordGameResult(result, against) {
    setHistory((history) => [...history, { result, against }]);

    if (result === "win") {
      setWins((wins) => wins + 1);
    } else if (result === "loss") {
      setLosses((losses) => losses + 1);
    } else {
      setDraws((draws) => draws + 1);
    }
  }

  return [{ wins, losses, draws }, recordGameResult, history];
}

function App() {
  const [p1History, recordP1GameResult] = usePlayerHistory();
  const [p2History, recordP2GameResult] = usePlayerHistory();
  const [board, setBoard] = useState(createBoard());
  const [autoPlay, setAutoPlay] = useState(false);
  const p1Name = "P1";
  const p2Name = "P2";
  const [games, setGames] = useState([]);
  const [gameIndex, setGameIndex] = useState(-1);

  useEffect(() => {
    if (autoPlay) {
      const intervalId = setInterval(() => {
        playGameRecordResults();
      }, 100);
      return () => clearInterval(intervalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  function playGameRecordResults() {
    const game = autoPlayGame(p1Name, p2Name);

    if (game.winner === p1Name) {
      recordP1GameResult("win", p2Name);
      recordP2GameResult("loss", p1Name);
    } else if (game.winner === p2Name) {
      recordP1GameResult("loss", p2Name);
      recordP2GameResult("win", p1Name);
    } else {
      recordP1GameResult("draw", p2Name);
      recordP2GameResult("draw", p1Name);
    }

    setGames((games) => [...games, game]);
  }

  useEffect(() => {
    setGameIndex(games.length - 1);
  }, [games.length]);

  useEffect(() => {
    if (gameIndex >= 0) {
      setBoard(games[gameIndex].board);
    }
  }, [gameIndex, games]);

  return (
    <div className="app">
      <GameStats
        p1Name={p1Name}
        p2Name={p2Name}
        p1Wins={p1History.wins}
        p2Wins={p2History.wins}
        draws={p1History.draws}
      />
      <button onClick={() => setAutoPlay(!autoPlay)}>Auto Play Games</button>
      <button
        onClick={() => setGameIndex(gameIndex - 1)}
        disabled={gameIndex <= 0}
      >
        {"<<"}
      </button>
      <button
        onClick={() => setGameIndex(gameIndex + 1)}
        disabled={gameIndex >= games.length - 1}
      >
        {">>"}
      </button>
      <br />
      <button onClick={playGameRecordResults}>Start Game</button>
      <button>{"<<"}</button>
      <button>{">>"}</button>
      <BoardDisplay board={board} p1Name={p1Name} p2Name={p2Name} />
    </div>
  );
}

export default App;
