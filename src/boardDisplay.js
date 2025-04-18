import { getCellWinner } from "./engine/board";

function BoardDisplay({ board, p1Name }) {
  function getGridCoordinates(row, col) {
    return {
      gridArea: `${row} / ${col} / ${row + 1} / ${col + 1}`,
    };
  }

  function getCellColor(x, y) {
    const winner = getCellWinner(board.cells, [x, y]);
    if (winner) {
      return winner === p1Name ? "green" : "red";
    } else {
      return "white";
    }
  }

  return (
    <div className="board-display">
      {board.cells.map((col, x) =>
        col.map((cell, y) => (
          <div
            key={`${x}-${y}`}
            className="cell"
            style={{
              ...getGridCoordinates(y + 1, x + 1),
              backgroundColor: getCellColor(x, y),
            }}
          >
            {cell}
          </div>
        ))
      )}
    </div>
  );
}

export default BoardDisplay;
