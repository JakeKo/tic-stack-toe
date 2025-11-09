import { useGame } from "../store/game";

function GameDialogs() {
  const { game, startGame, resetGame } = useGame();

  const showStartButton = !game.active;
  const showGameOverDialog = game.winner;
  const showDialog = showStartButton || showGameOverDialog;

  return (
    showDialog && (
      <div className="game-dialog-container">
        {showStartButton && (
          <button className="game-button" onClick={() => startGame()}>
            Start
          </button>
        )}
        {showGameOverDialog && (
          <div className="game-over-dialog">
            <h2>{game.winner} wins!</h2>
            <button className="game-button" onClick={() => resetGame()}>
              Play Again
            </button>
          </div>
        )}
      </div>
    )
  );
}

export default GameDialogs;
