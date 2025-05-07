function createPlayer(name, strategy, inventory = [2, 2, 2]) {
  const player = {
    name,
    isManual: !strategy,
    inventory,
    strategy,
    turnCount: 0,
    playedPiecesCount: 0,
    numSizes: 3,
    numPiecesPerSize: 2,
  };

  return player;
}

export { createPlayer };
