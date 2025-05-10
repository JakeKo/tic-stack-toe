import { compKey } from "../utils";
import BoardCell from "./BoardCell";
import GamePiece from "./GamePiece";

function BoardDisplay({ game, handleCommand }) {
  return (
    <div className="board-display" style={{ width: "500px" }}>
      {game.board.cells.map((col, x) =>
        col.map((cell, y) => {
          return (
            <BoardCell
              key={compKey(x, y)}
              game={game}
              x={x}
              y={y}
              handleCommand={handleCommand}
            >
              {cell.map((pName, i) => {
                return (
                  pName && (
                    <GamePiece
                      key={compKey(x, y, i)}
                      playerName={pName}
                      size={i}
                      cell={[x, y]}
                    />
                  )
                );
              })}
            </BoardCell>
          );
        })
      )}
    </div>
  );
}

export default BoardDisplay;
