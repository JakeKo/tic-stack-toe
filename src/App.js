import { useEffect, useState } from "react";
import "./App.css";
import GameStats from "./gameStats";
import { checkForWinner, createBoard, issueCommand } from "./engine/board";
import { strategyRandom } from "./engine/strategy";
import { createPlayer } from "./engine/player";
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

function playGame(p1Name = "P1", p2Name = "P2") {
  let board = createBoard();
  let turnCount = 0;
  const p1 = createPlayer(p1Name);
  const p2 = createPlayer(p2Name);

  for (let i = 0; i < 100; i++) {
    const cmd1 = strategyRandom(p1, board.cells);
    board.cells = issueCommand(board.cells, cmd1);

    if (!cmd1.pluck) {
      const pieceSize = cmd1.slot[2];
      p1.inventory[pieceSize]--;
    }

    turnCount++;
    if (checkForWinner(board.cells)) {
      break;
    }

    const cmd2 = strategyRandom(p2, board.cells);
    board.cells = issueCommand(board.cells, cmd2);

    if (!cmd2.pluck) {
      const pieceSize = cmd2.slot[2];
      p2.inventory[pieceSize]--;
    }

    turnCount++;
    if (checkForWinner(board.cells)) {
      break;
    }
  }

  return {
    board,
    turnCount,
    winner: checkForWinner(board.cells),
  };
}

function App() {
  const [p1History, recordP1GameResult] = usePlayerHistory();
  const [p2History, recordP2GameResult] = usePlayerHistory();
  const [board, setBoard] = useState(createBoard());
  const [playGames, setPlayGames] = useState(false);
  const p1Name = "P1";
  const p2Name = "P2";

  useEffect(() => {
    if (playGames) {
      const intervalId = setInterval(() => {
        playGameRecordResults();
      }, 1000);
      return () => clearInterval(intervalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playGames]);

  function playGameRecordResults() {
    const { board, winner } = playGame(p1Name, p2Name);

    if (winner === p1Name) {
      recordP1GameResult("win", p2Name);
      recordP2GameResult("loss", p1Name);
    } else if (winner === p2Name) {
      recordP1GameResult("loss", p2Name);
      recordP2GameResult("win", p1Name);
    } else {
      recordP1GameResult("draw", p2Name);
      recordP2GameResult("draw", p1Name);
    }

    setBoard(board);
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
      <button onClick={playGameRecordResults}>Play Game</button>
      <button onClick={() => setPlayGames(!playGames)}>Play Games</button>
      <BoardDisplay board={board} p1Name={p1Name} />
    </div>
  );
}

export default App;
