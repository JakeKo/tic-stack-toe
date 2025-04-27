import { getCellWinner } from "../engine/board";

const PIECE_SIZE = 20;

function BoardDisplay({ board, p1Name, p2Name }) {
  const BACKGROUND_COLOR_MAP = {
    [p1Name]: "rgba(0, 255, 0, 0.2)",
    [p2Name]: "rgba(255, 0, 0, 0.2)",
    undefined: "white",
  };
  const PIECE_COLOR_MAP = {
    [p1Name]: "green",
    [p2Name]: "red",
  };

  function getCellStyle(x, y) {
    const winner = getCellWinner(board.cells, [x, y]);
    return {
      gridArea: `${y + 1} / ${x + 1} / ${y + 2} / ${x + 2}`,
      backgroundColor: BACKGROUND_COLOR_MAP[winner],
    };
  }

  function getPieceStyle(playerName, index) {
    return {
      border: `${PIECE_SIZE}px solid ${PIECE_COLOR_MAP[playerName]}`,
      width: `${(index + 1) * PIECE_SIZE * 2}px`,
      zIndex: board.slotCount - index,
    };
  }

  return (
    <div className="board-display" style={{ width: "500px" }}>
      {board.cells.map((col, x) =>
        col.map((cell, y) => (
          <div key={`${x}-${y}`} className="cell" style={getCellStyle(x, y)}>
            {cell.map(
              (player, index) =>
                player && (
                  <div
                    key={`${x}-${y}-${index}`}
                    className="piece"
                    style={getPieceStyle(player, index)}
                  />
                )
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default BoardDisplay;
