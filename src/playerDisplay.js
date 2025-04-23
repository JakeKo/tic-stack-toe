const PIECE_SIZE = 20;

function PlayerDisplay({ player, isP1 }) {
  function getInventoryStyle() {
    const widestPiece = player.numSizes * PIECE_SIZE * 2;
    return {
      gridTemplateColumns: `repeat(${player.numPiecesPerSize}, ${widestPiece}px)`,
      gridTemplateRows: Array.from(
        { length: player.numSizes },
        (_, i) => `${PIECE_SIZE * 2 * (i + 1)}px`
      ).join(" "),
    };
  }

  function getPieceStyle(row, col) {
    return {
      border: `${PIECE_SIZE}px solid ${isP1 ? "green" : "red"}`,
      width: `${(row + 1) * PIECE_SIZE * 2}px`,
      gridArea: `${row + 1} / ${col + 1} / span 1 / span 1`,
    };
  }

  return (
    <div className="player-display">
      <h1>{player.name}</h1>
      <div className="player-inventory" style={getInventoryStyle()}>
        {player.inventory.map((count, size) =>
          Array.from({ length: count }, (_, i) => (
            <div
              key={`${size}-${i}`}
              className="piece"
              style={getPieceStyle(size, i)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default PlayerDisplay;
