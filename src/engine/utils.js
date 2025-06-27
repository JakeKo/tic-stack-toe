const PIECE_SIZE_UNIT = 20;

function gamePieceSize(size) {
  return (size + 1) * PIECE_SIZE_UNIT * 2;
}

function nArray(n) {
  return Array.from({ length: n }, (_, i) => i);
}

function findLastIndex(list, searchFunc) {
  let i = list.length - 1;
  for (i; i >= 0; i--) {
    if (searchFunc(list[i])) {
      return i;
    }
  }

  return i;
}

function compKey(...args) {
  return args.join("-");
}

export { PIECE_SIZE_UNIT, gamePieceSize, nArray, findLastIndex, compKey };
