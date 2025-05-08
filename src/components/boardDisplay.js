import { getCellWinner } from "../engine/board";
import { cellColorGenerator, findLastIndex } from "../utils";
import GamePiece from "./GamePiece";
import GamePieceDraggable from "./GamePieceDraggable";

function BoardDisplay({ game }) {
  const cellColor = cellColorGenerator(game.p1.name, game.p2.name);

  function getCellStyle(x, y) {
    const winner = getCellWinner(game.board.cells, [x, y]);
    return {
      gridArea: `${y + 1} / ${x + 1} / span 1 / span 1`,
      backgroundColor: cellColor(winner),
    };
  }

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
          <div key={`${x}-${y}`} className="cell" style={getCellStyle(x, y)}>
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
          </div>
        ))
      )}
    </div>
  );
}

export default BoardDisplay;
