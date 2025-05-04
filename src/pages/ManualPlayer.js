import { useState } from "react";
import PlayerDisplay from "../components/playerDisplay";
import BoardDisplay from "../components/boardDisplay";
import { createGame, playNextCommand } from "../engine/game";
import { strategyRandom } from "../engine/strategy";

function ManualPlayer() {
  const [game, setGame] = useState(
    createGame("P1", "P2", null, strategyRandom)
  );
  const [, setForceRefresh] = useState(false);

  function handleCommand(command) {
    const fullCommand = {
      player: game.activePlayer.name,
      slot: JSON.parse(command),
    };

    const newGame = playNextCommand(game, fullCommand);
    setGame(newGame);
    setForceRefresh((prev) => !prev); // Trigger a re-render
  }

  return (
    <div className="app">
      <div className="game-container">
        <PlayerDisplay
          player={game.p1}
          isP1
          isActive={game.activePlayer === game.p1}
          handleCommand={handleCommand}
        />
        <BoardDisplay
          board={game.board}
          p1Name={game.p1.name}
          p2Name={game.p2.name}
        />
        <PlayerDisplay
          player={game.p2}
          isActive={game.activePlayer === game.p2}
          handleCommand={handleCommand}
        />
      </div>
    </div>
  );
}

export default ManualPlayer;
