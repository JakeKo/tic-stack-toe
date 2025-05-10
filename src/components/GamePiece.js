import { useDrag } from "react-dnd";
import { PIECE_SIZE_UNIT, gamePieceColor, gamePieceSize } from "../utils";

function GamePiece({ isP1, size, cell }) {
  const [, dragRef] = useDrag({
    type: "game-piece",
    item: { size, cell },
  });

  return (
    <div
      ref={dragRef}
      className="piece draggable"
      style={{
        border: `${PIECE_SIZE_UNIT}px solid ${gamePieceColor(isP1)}`,
        width: `${gamePieceSize(size)}px`,
      }}
    />
  );
}

export default GamePiece;
