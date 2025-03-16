function RANDOM_STRATEGY(player, board) {
  const allPossibleCommands = getAllPossibleCommands(
    board,
    player.name,
    player.inventory
  );

  if (allPossibleCommands.length === 0) {
    return;
  } else {
    const randomIndex = Math.floor(Math.random() * allPossibleCommands.length);
    return allPossibleCommands[randomIndex];
  }
}

function getAllPossibleCommands(board, playerName, playerInventory) {
  const pluckablePieces = board.getAllPluckablePieces(playerName);
  const openSlots = board.getAllOpenSlots();
  const allPossibleCommands = [];

  // Get all possible commands that involve plucking and placing a piece
  pluckablePieces.forEach((piece) => {
    openSlots.forEach((slot) => {
      if (piece[2] === slot[2]) {
        allPossibleCommands.push({
          player: playerName,
          pluck: piece,
          slot: slot,
        });
      }
    });
  });

  // Get all possible commands that involve placing a piece without plucking
  openSlots.forEach((slot) => {
    playerInventory.forEach((count, piece) => {
      if (count > 0 && slot[2] === piece) {
        allPossibleCommands.push({ player: playerName, slot: slot });
      }
    });
  });

  return allPossibleCommands;
}

class Player {
  constructor(name, inventory = [2, 2, 2], strategy = RANDOM_STRATEGY) {
    this.name = name;
    this.inventory = inventory;
    this.strategy = strategy;
  }

  getCommand(board) {
    return this.strategy(this, board);
  }
}

export default Player;
export { RANDOM_STRATEGY, getAllPossibleCommands };
