import { findLastIndex } from "../utils";
import BoardCell from "./BoardCell";
import GamePiece from "./GamePiece";
import GamePieceDraggable from "./GamePieceDraggable";

function BoardDisplay({ game }) {
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
        col.map((cell, y) => (
          <BoardCell key={`${x}-${y}`} game={game} x={x} y={y}>
            {cell.map(
              (pName, i) =>
                pName &&
                (canDragPiece(pName, [x, y, i]) ? (
                  <GamePieceDraggable
                    key={`${x}-${y}-${i}`}
                    isP1={pName === game.p1.name}
                    size={i}
                  />
                ) : (
                  <GamePiece
                    key={`${x}-${y}-${i}`}
                    isP1={pName === game.p1.name}
                    size={i}
                  />
                )) // eslint-disable-line react/jsx-no-bind
            )}
          </BoardCell>
        ))
      )}
    </div>
  );
}

export default BoardDisplay;
