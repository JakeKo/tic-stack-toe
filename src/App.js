import { useEffect, useState } from "react";
import "./App.css";
import GameStats from "./gameStats";
import { autoPlayGame, autoPlayNextMove, createGame } from "./engine/game";
import BoardDisplay from "./boardDisplay";
import PlayerDisplay from "./playerDisplay";

const AUTO_PLAY_INTERVAL = 100;

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

// Update gameIndex and reset snapshotIndex with Prev/Next Game buttons
// Update snapshotIndex with Prev/Next Command buttons
// Update gameIndex, snapshotIndex, and games with Start Game button
// Update gameIndex and games with Auto Play Games button

// Update currentGame when gameIndex or snapshotIndex changes
// Update board and player displays when currentGame changes

function App() {
  const [p1History, recordP1GameResult] = usePlayerHistory();
  const [p2History, recordP2GameResult] = usePlayerHistory();
  const [currentGame, setCurrentGame] = useState();
  const [snapshotIndex, setSnapshotIndex] = useState(-1);
  const [autoPlay, setAutoPlay] = useState(false);
  const p1Name = "P1";
  const p2Name = "P2";
  const [games, setGames] = useState([]);
  const [gameIndex, setGameIndex] = useState(-1);

  useEffect(() => {
    if (autoPlay) {
      const intervalId = setInterval(() => {
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

        setCurrentGame(game);
        setGameIndex(games.length);
        setSnapshotIndex(game.turnCount - 1);
        setGames((games) => [...games, game]);
      }, AUTO_PLAY_INTERVAL);

      return () => clearInterval(intervalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  function nextGame() {
    if (gameIndex < games.length - 1) {
      const nextGame = games[gameIndex + 1];
      setCurrentGame(nextGame);
      setGameIndex(gameIndex + 1);
      setSnapshotIndex(nextGame.turnCount - 1);
    }
  }

  function previousGame() {
    if (gameIndex > 0) {
      const prevGame = games[gameIndex - 1];
      setCurrentGame(prevGame);
      setGameIndex(gameIndex - 1);
      setSnapshotIndex(prevGame.turnCount - 1);
    }
  }

  function nextCommand() {
    if (!currentGame) {
      return;
    }

    // If we are at the end of the command history, we need to auto-play the next move
    // and update the command index to the new end of the history
    if (snapshotIndex < currentGame.turnCount - 1) {
      const nextIndex = snapshotIndex + 1;
      setSnapshotIndex(nextIndex);
      // TODO: Track and update player inventories
    } else {
      const newGame = autoPlayNextMove(currentGame);
      setCurrentGame(newGame);
      setSnapshotIndex(newGame.turnCount - 1);
    }
  }

  function previousCommand() {
    if (currentGame && snapshotIndex > 0) {
      setSnapshotIndex(snapshotIndex - 1);
      // TODO: Track and update player inventories
    }
  }

  function toggleGame() {
    if (currentGame && !currentGame.board.winner) {
      const prevGame = games[gameIndex - 1];
      setGameIndex(gameIndex - 1);
      setSnapshotIndex(prevGame.turnCount - 1);
      setGames((games) => void games.pop());
    } else {
      const game = createGame(p1Name, p2Name);
      setGameIndex(games.length);
      setSnapshotIndex(0);
      setGames((games) => [...games, game]);
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
      <button onClick={() => setAutoPlay(!autoPlay)}>
        {autoPlay ? "Stop Auto Play" : "Auto Play Games"}
      </button>
      <button onClick={previousGame} disabled={gameIndex <= 0}>
        {"<<"}
      </button>
      <button onClick={nextGame} disabled={gameIndex >= games.length - 1}>
        {">>"}
      </button>
      {gameIndex} / {games.length} ({snapshotIndex})
      <br />
      <button onClick={toggleGame}>{currentGame ? "End" : "Start"} Game</button>
      <button onClick={previousCommand} disabled={snapshotIndex <= 0}>
        {"<<"}
      </button>
      <button
        onClick={nextCommand}
        disabled={snapshotIndex >= currentGame?.turnCount - 1}
      >
        {">>"}
      </button>
      {currentGame && (
        <div className="game-container">
          <PlayerDisplay player={currentGame.p1} isP1 />
          <BoardDisplay
            board={currentGame.board}
            p1Name={currentGame.p1.name}
            p2Name={currentGame.p2.name}
          />
          <PlayerDisplay player={currentGame.p2} />
        </div>
      )}
    </div>
  );
}

export default App;
