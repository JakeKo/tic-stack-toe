import { PIECE_SIZE_UNIT, gamePieceColor, gamePieceSize } from "../utils";

function GamePiece({ isP1, size }) {
  return (
    <div
      className="piece"
      style={{
        border: `${PIECE_SIZE_UNIT}px solid ${gamePieceColor(isP1)}`,
        width: `${gamePieceSize(size)}px`,
      }}
    />
  );
}

export default GamePiece;
