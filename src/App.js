import { useState } from "react";
import "./App.css";
import GameStats from "./gameStats";
import {
  checkForWinner,
  createBoard,
  issueCommand,
  toPlaintextString,
} from "./engine/board";
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

function playGame() {
  let board = createBoard();
  const p1 = createPlayer("p1");
  const p2 = createPlayer("p2");

  for (let i = 0; i < 25; i++) {
    const cmd1 = strategyRandom(p1, board.cells);
    board.cells = issueCommand(board.cells, cmd1);

    if (!cmd1.pluck) {
      const pieceSize = cmd1.slot[2];
      p1.inventory[pieceSize]--;
    }

    if (checkForWinner(board.cells)) {
      break;
    }

    const cmd2 = strategyRandom(p2, board.cells);
    board.cells = issueCommand(board.cells, cmd2);

    if (!cmd2.pluck) {
      const pieceSize = cmd2.slot[2];
      p2.inventory[pieceSize]--;
    }

    if (checkForWinner(board.cells)) {
      break;
    }
  }

  console.log(toPlaintextString(board));
  return board;
}

function App() {
  const [p1History, recordP1GameResult] = usePlayerHistory();
  const [p2History, recordP2GameResult] = usePlayerHistory();
  const [board, setBoard] = useState(createBoard());

  function playGameRecordResults() {
    const board = playGame();
    const winner = checkForWinner(board.cells);

    if (winner === "p1") {
      recordP1GameResult("win", "A");
      recordP2GameResult("loss", "B");
    } else if (winner === "p2") {
      recordP1GameResult("loss", "A");
      recordP2GameResult("win", "B");
    } else {
      recordP1GameResult("draw", "A");
      recordP2GameResult("draw", "B");
    }

    setBoard(board);
  }

  return (
    <div className="app">
      <GameStats
        p1Name={"p1"}
        p2Name={"p2"}
        p1Wins={p1History.wins}
        p2Wins={p2History.wins}
        draws={p1History.draws}
      />
      <button onClick={playGameRecordResults}>Play Game</button>
      <BoardDisplay board={board} />
    </div>
  );
}

export default App;
