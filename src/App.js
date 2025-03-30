import { useState } from "react";
import "./App.css";
import GameStats from "./gameStats";
import { createBoard, issueCommand, toConsoleString } from "./engine/board";
import { strategyRandom } from "./engine/strategy";
import { createPlayer } from "./engine/player";

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

  for (let i = 0; i < 10; i++) {
    const cmd1 = strategyRandom(p1, board.cells);
    board.cells = issueCommand(board.cells, cmd1);

    if (!cmd1.pluck) {
      const pieceSize = cmd1.slot[2];
      p1.inventory[pieceSize]--;
    }

    const cmd2 = strategyRandom(p2, board.cells);
    board.cells = issueCommand(board.cells, cmd2);

    if (!cmd2.pluck) {
      const pieceSize = cmd2.slot[2];
      p2.inventory[pieceSize]--;
    }
  }

  return toConsoleString(board);
}

function App() {
  const [p1History, recordP1GameResult] = usePlayerHistory();
  const [p2History, recordP2GameResult] = usePlayerHistory();
  playGame();

  return (
    <div className="app">
      <GameStats
        playerAName={"A"}
        playerBName={"B"}
        playerAWins={p1History.wins}
        playerBWins={p2History.wins}
        draws={p1History.draws}
      />
    </div>
  );
}

export default App;
