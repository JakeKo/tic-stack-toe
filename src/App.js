import { useEffect, useState } from "react";
import "./App.css";
import GameStats from "./gameStats";
import { createBoard } from "./engine/board";
import { autoPlayGame, createGame } from "./engine/game";
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
  const [currentGame, setCurrentGame] = useState();
  const [commandIndex, setCommandIndex] = useState(-1);
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

  // Set the initial game index to the last game in the games array
  useEffect(() => {
    setGameIndex(games.length - 1);
  }, [games.length]);

  // Update the board when the game index changes
  useEffect(() => {
    gameIndex >= 0 && setBoard(games[gameIndex].board);
  }, [gameIndex, games]);

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

  function nextCommand() {
    if (!currentGame) {
      return;
    }

    if (commandIndex < currentGame.boardHistory.length - 1) {
      const nextIndex = commandIndex + 1;
      setCommandIndex(nextIndex);
      setBoard(currentGame.boardHistory[nextIndex]);
    } else {
      // TODO: Play the next round
    }
  }

  function previousCommand() {
    if (!currentGame) {
      return;
    }

    if (commandIndex > 0) {
      const prevIndex = commandIndex - 1;
      setCommandIndex(prevIndex);
      setBoard(currentGame.boardHistory[prevIndex]);
    }
  }

  function toggleGame() {
    if (currentGame) {
      setCurrentGame(undefined);
      setCommandIndex(-1);
      setBoard(createBoard());
    } else {
      const game = createGame();
      setCurrentGame(game);
      setCommandIndex(0);
      setBoard(game.board);
    }
  }

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
      <button onClick={toggleGame}>Start Game</button>
      <button
        onClick={previousCommand}
        disabled={!currentGame || commandIndex <= 0}
      >
        {"<<"}
      </button>
      <button
        onClick={nextCommand}
        disabled={
          !currentGame || commandIndex >= currentGame.boardHistory.length - 1
        }
      >
        {">>"}
      </button>
      <BoardDisplay board={board} p1Name={p1Name} p2Name={p2Name} />
    </div>
  );
}

export default App;
