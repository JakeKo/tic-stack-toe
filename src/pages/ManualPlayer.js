import { useEffect, useState } from "react";
import PlayerDisplay from "../components/PlayerDisplay";
import BoardDisplay from "../components/BoardDisplay";
import { createGame, playNextCommand } from "../engine/game";
import { strategyRandom } from "../engine/strategy";
import Navigation from "../components/Navigation";

function ManualPlayer() {
  const [game, setGame] = useState(
    createGame("P1", "P2", null, strategyRandom)
  );

  function handleCommand(command) {
    const newGame = playNextCommand(game, command);
    setGame(newGame);
  }

  useEffect(() => {
    const { activePlayer: p } = game;

    if (!p.isManual) {
      setTimeout(() => {
        const command = p.strategy(p, game);
        const newGame = playNextCommand(game, command);
        setGame(newGame);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.activePlayer]);

  return (
    <div className="app">
      <Navigation />
      <div className="game-container">
        <PlayerDisplay
          player={game.p1}
          isP1
          isActive={game.activePlayer.name === game.p1.name}
        />
        <BoardDisplay game={game} handleCommand={handleCommand} />
        <PlayerDisplay
          player={game.p2}
          isActive={game.activePlayer.name === game.p2.name}
        />
      </div>
    </div>
  );
}

export default ManualPlayer;
