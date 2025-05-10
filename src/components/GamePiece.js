import { useDrag } from "react-dnd";
import { PIECE_SIZE_UNIT, gamePieceSize } from "../utils";
import { useGamePieceColor } from "../store/game";

function GamePiece({ playerName, size, cell }) {
  const gamePieceColor = useGamePieceColor(playerName);

  const [, dragRef] = useDrag({
    type: "game-piece",
    item: { size, cell },
  });

  return (
    <div
      ref={dragRef}
      className="piece draggable"
      style={{
        border: `${PIECE_SIZE_UNIT}px solid ${gamePieceColor}`,
        width: `${gamePieceSize(size)}px`,
      }}
    />
  );
}

export default GamePiece;
