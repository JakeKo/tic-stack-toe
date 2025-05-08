import { gamePieceSize } from "../utils";

function GamePieceShadow({ size }) {
  return (
    <div
      className="piece-shadow"
      style={{
        width: `${gamePieceSize(size)}px`,
      }}
    />
  );
}

export default GamePieceShadow;
