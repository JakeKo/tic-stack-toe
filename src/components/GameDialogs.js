import { useDispatch } from "react-redux";
import { resetGame, startGame, useGame } from "../store/game";

function GameDialogs() {
  const game = useGame();
  const dispatch = useDispatch();

  const showStartButton = !game.active;
  const showGameOverDialog = game.winner;
  const showDialog = showStartButton || showGameOverDialog;

  return (
    showDialog && (
      <div className="game-dialog-container">
        {showStartButton && (
          <button className="game-button" onClick={() => dispatch(startGame())}>
            Start
          </button>
        )}
        {showGameOverDialog && (
          <div className="game-over-dialog">
            <h2>{game.winner} wins!</h2>
            <button
              className="game-button"
              onClick={() => dispatch(resetGame())}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    )
  );
}

export default GameDialogs;
