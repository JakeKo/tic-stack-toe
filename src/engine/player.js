function createPlayer(name, strategy, inventory = [2, 2, 2]) {
  const player = {
    name,
    inventory,
    turnCount: 0,
    playedPiecesCount: 0,
    numSizes: 3,
    numPiecesPerSize: 2,
  };

  player.getCommand = function (game) {
    if (strategy) {
      return strategy(player, game.board.cells);
    } else {
      return () => {};
    }
  };

  return player;
}

export { createPlayer };
