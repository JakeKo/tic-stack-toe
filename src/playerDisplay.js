const PIECE_SIZE = 20;

function PlayerDisplay({ player }) {
  function getPieceStyle(index) {
    return {
      border: `${PIECE_SIZE}px solid grey`,
      width: `${(index + 1) * PIECE_SIZE * 2}px`,
    };
  }

  return (
    <div className="player-display">
      <div className="player-name">{player.name}</div>
      <div className="player-inventory">
        {player.inventory.map((count, size) => (
          <div key={size} className="player-inventory-row">
            {Array.from({ length: count }, (_, i) => (
              <div
                key={`${size}-${i}`}
                className="piece"
                style={getPieceStyle(size)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerDisplay;
