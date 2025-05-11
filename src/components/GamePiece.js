import { useDrag } from "react-dnd";
import { PIECE_SIZE_UNIT, gamePieceSize } from "../utils";
import { useGame, useGamePieceColor } from "../store/game";

function GamePiece({ playerName, size, address }) {
  const game = useGame();
  const gamePieceColor = useGamePieceColor(playerName);
  const canDrag = playerName === game.activePlayer?.name;

  const [, dragRef] = useDrag({
    type: "game-piece",
    canDrag,
    item: { size, address, playerName },
  });

  return (
    <div
      ref={dragRef}
      className={`piece ${canDrag && "draggable"}`}
      style={{
        border: `${PIECE_SIZE_UNIT}px solid ${gamePieceColor}`,
        width: `${gamePieceSize(size)}px`,
      }}
    />
  );
}

export default GamePiece;
