function createPlayer(name, strategy, inventory = [2, 2, 2]) {
  const player = { name, inventory, turnCount: 0, playedPiecesCount: 0 };

  player.getCommand = function (game) {
    return strategy(player, game.board.cells);
  };

  return player;
}

export { createPlayer };
