function listToN(n) {
  return [...Array(n).keys()];
}

function Player(numSizes = 3) {
  const pieces = [...listToN(numSizes), ...listToN(numSizes)];

  function has(piece) {
    return pieces.includes(piece);
  }

  function pullPieceFromInventory(piece) {
    const index = pieces.indexOf(piece);
    if (index === -1) {
      return undefined;
    } else {
      pieces.splice(index, 1);
    }
  }

  function isOutOfPieces() {
    return pieces.length === 0;
  }

  return {
    has,
    pullPieceFromInventory,
    isOutOfPieces,
  };
}

export default Player;
