import { useEffect, useState } from "react";
import PlayerDisplay from "../components/PlayerDisplay";
import BoardDisplay from "../components/BoardDisplay";
import { createGame, playNextCommand } from "../engine/game";
import { strategyRandom } from "../engine/strategy";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function ManualPlayer() {
  const [game, setGame] = useState(
    createGame("P1", "P2", null, strategyRandom)
  );

  function handleCommand(command) {
    const fullCommand = {
      player: game.activePlayer.name,
      slot: JSON.parse(command),
    };

    const newGame = playNextCommand(game, fullCommand);
    setGame(newGame);
  }

  useEffect(() => {
    const { activePlayer: p, board } = game;

    if (!p.isManual) {
      const command = p.strategy(p, board.cells);
      const newGame = playNextCommand(game, command);
      setGame(newGame);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.activePlayer]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <div className="game-container">
          <PlayerDisplay
            player={game.p1}
            isP1
            isActive={game.activePlayer.name === game.p1.name}
            handleCommand={handleCommand}
          />
          <BoardDisplay
            board={game.board}
            p1Name={game.p1.name}
            p2Name={game.p2.name}
          />
          <PlayerDisplay
            player={game.p2}
            isActive={game.activePlayer.name === game.p2.name}
            handleCommand={handleCommand}
          />
        </div>
      </div>
    </DndProvider>
  );
}

export default ManualPlayer;
