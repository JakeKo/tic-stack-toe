function BoardDisplay({ board }) {
  function getGridCoordinates(row, col) {
    return {
      gridArea: `${row} / ${col} / ${row + 1} / ${col + 1}`,
    };
  }

  return (
    <div className="board-display">
      {board.cells.map((row, rowIndex) =>
        row.map((cell, cellIndex) => (
          <div
            key={`${rowIndex}-${cellIndex}`}
            className="cell"
            style={getGridCoordinates(rowIndex, cellIndex)}
          >
            {cell}
          </div>
        ))
      )}
    </div>
  );
}

export default BoardDisplay;
