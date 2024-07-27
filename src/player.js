function listToN(n) {
  return [...Array(n).keys()];
}

function Player(name, numSizes = 3, numSets = 2) {
  const pieces = listToN(numSets)
    .map(() => listToN(numSizes))
    .reduce((t, v) => [...t, ...v])
    .map((v) => `${name}${v}`);
  // console.log(pieces);

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

  function getRandomPiece() {
    const index = Math.round(Math.random() * (pieces.length - 1));
    return pieces[index];
  }

  return {
    name,
    has,
    pullPieceFromInventory,
    isOutOfPieces,
    getRandomPiece,
  };
}

export default Player;
