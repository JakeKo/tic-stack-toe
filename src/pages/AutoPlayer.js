import { useEffect, useState } from "react";
import GameStats from "../components/gameStats";
import { autoPlayGame, autoPlayNextMove } from "../engine/game";
import BoardDisplay from "../components/boardDisplay";
import PlayerDisplay from "../components/playerDisplay";

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

function AutoPlayer() {
  const [p1History, recordP1GameResult] = usePlayerHistory();
  const [p2History, recordP2GameResult] = usePlayerHistory();
  const [currentGame, setCurrentGame] = useState();
  const [currentSnapshot, setCurrentSnapshot] = useState();
  const [snapshotIndex, setSnapshotIndex] = useState(-1);
  const [autoPlay, setAutoPlay] = useState(false);
  const p1Name = "P1";
  const p2Name = "P2";
  const [games, setGames] = useState([]);
  const [gameIndex, setGameIndex] = useState(-1);

  useEffect(() => {
    setGameIndex(games.length - 1);
  }, [games.length]);

  useEffect(() => {
    if (gameIndex >= 0 && gameIndex < games.length) {
      setCurrentGame(games[gameIndex]);
    }
  }, [games, gameIndex]);

  useEffect(() => {
    if (!currentGame) {
      setCurrentSnapshot();
    } else if (snapshotIndex >= 0 && snapshotIndex <= currentGame.turnCount) {
      setCurrentSnapshot(currentGame.snapshots[snapshotIndex]);
    }
  }, [snapshotIndex, currentGame]);

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

        setSnapshotIndex(game.turnCount);
        setGames((games) => [...games, game]);
      }, AUTO_PLAY_INTERVAL);

      return () => clearInterval(intervalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  function nextGame() {
    if (gameIndex < games.length - 1) {
      const nextGame = games[gameIndex + 1];
      setGameIndex(gameIndex + 1);
      setSnapshotIndex(nextGame.turnCount);
    }
  }

  function previousGame() {
    if (gameIndex > 0) {
      const prevGame = games[gameIndex - 1];
      setGameIndex(gameIndex - 1);
      setSnapshotIndex(prevGame.turnCount);
    }
  }

  function nextSnapshot() {
    if (snapshotIndex < currentGame.turnCount) {
      setSnapshotIndex(snapshotIndex + 1);
    } else {
      const newGame = autoPlayNextMove(currentGame);
      setSnapshotIndex(newGame.turnCount);
    }
  }

  function previousSnapshot() {
    if (snapshotIndex > 0) {
      setSnapshotIndex(snapshotIndex - 1);
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
      <button onClick={previousSnapshot} disabled={snapshotIndex <= 0}>
        {"<<"}
      </button>
      <button
        onClick={nextSnapshot}
        disabled={snapshotIndex >= currentGame?.turnCount}
      >
        {">>"}
      </button>
      {currentSnapshot && (
        <div className="game-container">
          <PlayerDisplay player={currentSnapshot.p1} isP1 />
          <BoardDisplay
            board={currentSnapshot.board}
            p1Name={currentSnapshot.p1.name}
            p2Name={currentSnapshot.p2.name}
          />
          <PlayerDisplay player={currentSnapshot.p2} />
        </div>
      )}
    </div>
  );
}

export default AutoPlayer;
