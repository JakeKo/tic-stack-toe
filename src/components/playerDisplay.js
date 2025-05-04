const PIECE_SIZE = 20;

function nArray(n) {
  return Array.from({ length: n }, (_, i) => i);
}

function PlayerDisplay({ player, isP1, isActive, handleCommand }) {
  function getInventoryStyle() {
    const widestPiece = player.numSizes * PIECE_SIZE * 2;
    return {
      gridTemplateColumns: `repeat(${player.numPiecesPerSize}, ${widestPiece}px)`,
      gridTemplateRows: nArray(player.numSizes)
        .map((i) => `${PIECE_SIZE * 2 * (i + 1)}px`)
        .join(" "),
    };
  }

  function getPieceShadowStyle(row, col) {
    return {
      gridArea: `${row + 1} / ${col + 1} / span 1 / span 1`,
      width: `${(row + 1) * PIECE_SIZE * 2}px`,
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
    <div className={`player-display ${isActive ? "active" : ""}`}>
      <h1>{player.name}</h1>
      <input
        type="text"
        disabled={!isActive}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleCommand(e.target.value);
            e.target.value = ""; // Clear input after submission
          }
        }}
        placeholder="[0, 0, 0]"
      />
      <div className="player-inventory" style={getInventoryStyle()}>
        {nArray(player.numSizes).map((row) =>
          nArray(player.numPiecesPerSize).map((col) => (
            <div
              key={`${row}-${col}`}
              className="piece-shadow"
              style={getPieceShadowStyle(row, col)}
            />
          ))
        )}
        {player.inventory.map((count, size) =>
          nArray(count).map((i) => (
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
