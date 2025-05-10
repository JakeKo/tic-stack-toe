import { compKey, findLastIndex } from "../utils";
import BoardCellDroppable from "./BoardCellDroppable";
import GamePieceDraggable from "./GamePieceDraggable";

function BoardDisplay({ game, handleCommand }) {
  function canDragPiece(pName, slot) {
    const [x, y, i] = slot;
    const isBiggestPiece =
      findLastIndex(game.board.cells[x][y], (s) => !!s) === i;
    return (
      game.activePlayer.name === pName &&
      game.activePlayer.isManual &&
      isBiggestPiece
    );
  }

  return (
    <div className="board-display" style={{ width: "500px" }}>
      {game.board.cells.map((col, x) =>
        col.map((cell, y) => {
          return (
            <BoardCellDroppable
              key={compKey(x, y)}
              game={game}
              x={x}
              y={y}
              handleCommand={handleCommand}
            >
              {cell.map((pName, i) => {
                // const GamePieceComponent = canDragPiece(pName, [x, y, i])
                //   ? GamePieceDraggable
                //   : GamePiece;
                return (
                  pName && (
                    <GamePieceDraggable
                      key={compKey(x, y, i)}
                      isP1={pName === game.p1.name}
                      size={i}
                      cell={[x, y]}
                    />
                  )
                );
              })}
            </BoardCellDroppable>
          );
        })
      )}
    </div>
  );
}

export default BoardDisplay;
