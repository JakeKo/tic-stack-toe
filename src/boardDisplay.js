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
      {board.cells.map((row, rowIndex) =>
        row.map((cell, cellIndex) => (
          <div
            key={`${rowIndex}-${cellIndex}`}
            className="cell"
            style={{
              ...getGridCoordinates(rowIndex, cellIndex),
              backgroundColor: getCellColor(rowIndex, cellIndex),
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
