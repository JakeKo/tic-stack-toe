import { gamePieceSize, nArray, compKey } from "../utils";
import GamePiece from "./GamePiece";
import GamePieceShadow from "./GamePieceShadow";

function PlayerDisplay({ player, isActive }) {
  const { name, inventory, numPiecesPerSize, numSizes } = player;
  const inventoryStyle = {
    gridTemplateColumns: `repeat(${numPiecesPerSize}, min-content)`,
    gridTemplateRows: nArray(numSizes)
      .map((i) => `${gamePieceSize(i)}px`)
      .join(" "),
  };

  function hasNPiecesOfSize(size, n) {
    return inventory[size] > n;
  }

  return (
    <div className={`player-display ${isActive ? "active" : ""}`}>
      <h1 className="player-name">{name}</h1>
      <div className="player-inventory" style={inventoryStyle}>
        {nArray(numSizes).map((size) =>
          nArray(numPiecesPerSize).map((pieceIndex) => (
            <div key={compKey(size, pieceIndex)}>
              {hasNPiecesOfSize(size, pieceIndex) ? (
                <GamePiece playerName={name} size={size} />
              ) : (
                <GamePieceShadow size={size} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PlayerDisplay;
