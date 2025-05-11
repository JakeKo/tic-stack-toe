import { useEffect } from "react";
import PlayerDisplay from "../components/PlayerDisplay";
import BoardDisplay from "../components/BoardDisplay";
import { playNextCommand } from "../engine/game";
import Navigation from "../components/Navigation";
import { setGame, startGame, useGame } from "../store/game";
import { useDispatch } from "react-redux";

function ManualPlayer() {
  const game = useGame();
  const dispatch = useDispatch();

  useEffect(() => {
    const { activePlayer: p } = game;

    if (p && !p.isManual) {
      setTimeout(() => {
        const command = p.strategy(p, game);
        const newGame = playNextCommand(game, command);
        dispatch(setGame(newGame));
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.activePlayer]);

  return (
    <div className="app">
      <Navigation />
      <div className="game-container">
        <div className="player-display-container" style={{ gridArea: "1 / 1" }}>
          <PlayerDisplay
            player={game.p1}
            isActive={game.activePlayer?.name === game.p1.name}
          />
        </div>
        {!game.active && (
          <div className="start-game-button-container">
            <button
              className="start-game-button"
              onClick={() => dispatch(startGame())}
            >
              Start
            </button>
          </div>
        )}
        <BoardDisplay cells={game.board.cells} />
        <div className="player-display-container" style={{ gridArea: "1 / 3" }}>
          <PlayerDisplay
            player={game.p2}
            isActive={game.activePlayer?.name === game.p2.name}
          />
        </div>
      </div>
    </div>
  );
}

export default ManualPlayer;
