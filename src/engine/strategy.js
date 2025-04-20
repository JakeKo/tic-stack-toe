import { getAllOpenSlots, getAllPluckablePieces } from "./board";

function getAllPossibleCommands(cells, playerName, playerInventory) {
  const pluckablePieces = getAllPluckablePieces(cells, playerName);
  const openSlots = getAllOpenSlots(cells);
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

function strategyRandom(player, cells) {
  const allPossibleCommands = getAllPossibleCommands(
    cells,
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

export { getAllPossibleCommands, strategyRandom };
