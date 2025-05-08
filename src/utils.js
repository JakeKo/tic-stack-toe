const PIECE_SIZE_UNIT = 20;

function gamePieceColor(isP1) {
  return isP1 ? "green" : "red";
}

function gamePieceSize(size) {
  return (size + 1) * PIECE_SIZE_UNIT * 2;
}

function nArray(n) {
  return Array.from({ length: n }, (_, i) => i);
}

export { PIECE_SIZE_UNIT, gamePieceColor, gamePieceSize, nArray };
