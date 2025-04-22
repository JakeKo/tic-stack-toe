function createPlayer(name, strategy, inventory = [2, 2, 2]) {
  const player = { name, inventory };

  player.getCommand = function (game) {
    return strategy(player, game.board.cells);
  };

  return player;
}

export { createPlayer };
