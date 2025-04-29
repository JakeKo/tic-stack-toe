import { useState } from "react";
import PlayerDisplay from "../components/playerDisplay";
import BoardDisplay from "../components/boardDisplay";
import { createGame } from "../engine/game";
import { strategyRandom } from "../engine/strategy";

function ManualPlayer() {
  const [game, setGame] = useState(
    createGame("P1", "P2", null, strategyRandom)
  );

  return (
    <div className="app">
      <div className="game-container">
        <PlayerDisplay player={game.p1} isP1 />
        <BoardDisplay
          board={game.board}
          p1Name={game.p1.name}
          p2Name={game.p2.name}
        />
        <PlayerDisplay player={game.p2} />
      </div>
    </div>
  );
}

export default ManualPlayer;
