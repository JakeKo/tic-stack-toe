import { compKey } from "../utils";
import BoardCell from "./BoardCell";

function BoardDisplay({ game, handleCommand }) {
  function handleDrop(payload) {
    const player = game.activePlayer.name;
    handleCommand({ player, ...payload });
  }

  return (
    <div className="board-display" style={{ width: "500px" }}>
      {game.board.cells.map((col, x) =>
        col.map((cell, y) => {
          return (
            <BoardCell
              key={compKey(x, y)}
              game={game}
              cell={cell}
              address={[x, y]}
              handleDrop={handleDrop}
            />
          );
        })
      )}
    </div>
  );
}

export default BoardDisplay;
