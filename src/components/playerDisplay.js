import { gamePieceSize, PIECE_SIZE_UNIT, nArray, compKey } from "../utils";
import GamePiece from "./GamePiece";
import GamePieceDraggable from "./GamePieceDraggable";
import GamePieceShadow from "./GamePieceShadow";

function PlayerDisplay({ player, isP1, isActive }) {
  const GamePieceComponent = isActive ? GamePieceDraggable : GamePiece;
  const playerName = isActive ? `> ${player.name} <` : player.name;

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
    <div className="player-display">
      <h1>{playerName}</h1>
      <div className="player-inventory" style={getInventoryStyle()}>
        {nArray(player.numSizes).map((size) =>
          nArray(player.numPiecesPerSize).map((pieceIndex) => (
            <div key={compKey(size, pieceIndex)}>
              {hasNPiecesOfSize(size, pieceIndex) ? (
                <GamePieceComponent isP1={isP1} size={size} />
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
