import { gamePieceSize, PIECE_SIZE_UNIT, nArray } from "../utils";
import GamePiece from "./GamePiece";
import GamePieceDraggable from "./GamePieceDraggable";

function PlayerDisplay({ player, isP1, isActive }) {
  function getInventoryStyle() {
    const widestPiece = player.numSizes * PIECE_SIZE_UNIT * 2;
    return {
      gridTemplateColumns: `repeat(${player.numPiecesPerSize}, ${widestPiece}px)`,
      gridTemplateRows: nArray(player.numSizes)
        .map((i) => `${gamePieceSize(i)}px`)
        .join(" "),
    };
  }

  function hasNPiecesOfSize(size, n) {
    return player.inventory[size] > n;
  }

  return (
    <div className={`player-display ${isActive ? "active" : ""}`}>
      <h1>{player.name}</h1>
      <div className="player-inventory" style={getInventoryStyle()}>
        {nArray(player.numSizes).map((size) =>
          nArray(player.numPiecesPerSize).map((pieceIndex) => (
            <div key={`${size}-${pieceIndex}`}>
              {hasNPiecesOfSize(size, pieceIndex) ? (
                isActive ? (
                  <GamePieceDraggable isP1={isP1} size={size} />
                ) : (
                  <GamePiece isP1={isP1} size={size} />
                )
              ) : (
                <div
                  className="piece-shadow"
                  style={{
                    width: `${gamePieceSize(size)}px`,
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PlayerDisplay;
