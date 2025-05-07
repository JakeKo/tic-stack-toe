function createPlayer(name, strategy, inventory = [2, 2, 2]) {
  const player = {
    name,
    inventory,
    strategy,
    turnCount: 0,
    playedPiecesCount: 0,
    numSizes: 3,
    numPiecesPerSize: 2,
  };

  return player;
}

function getCommand(player, game) {
  if (player.strategy) {
    return player.strategy(player, game.board.cells);
  } else {
    return () => {};
  }
}

export { createPlayer, getCommand };
