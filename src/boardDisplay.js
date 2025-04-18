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
      return winner === p1Name ? "lightgreen" : "lightcoral";
    } else {
      return "white";
    }
  }

  function getPieceStyle(playerName, index) {
    return {
      borderColor: playerName === p1Name ? "green" : "red",
      width: `${(index + 1) * 40}px`,
      zIndex: board.slotCount - index,
    };
  }

  return (
    <div className="board-display" style={{ width: "500px" }}>
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
            {cell.map((player, index) => {
              if (player) {
                return (
                  <div
                    key={`${x}-${y}-${index}`}
                    className="piece"
                    style={getPieceStyle(player, index)}
                  ></div>
                );
              }
              return null;
            })}
          </div>
        ))
      )}
    </div>
  );
}

export default BoardDisplay;
