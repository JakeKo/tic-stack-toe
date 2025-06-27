import { produce } from "immer";
import { getAllOpenSlots, getAllPluckablePieces, getCellWinner } from "./board";

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

// Selects a random item from a list with relative weighting per item
// Example: A two-item list with weights [1, 1] means a 50-50 split
// Example: A two item list with weights [1, 2] means a 33-67 split
function pickRandom(list, weights) {
  if (list.length === 0) {
    return;
  }

  if (!weights) {
    weights = Array(list.length).fill(1);
  }

  // Create a list of weight sums
  // Example: Weights [1, 1, 1] => Sums [1, 2, 3]
  // Example: Weights [1, 2, 3] => Sums [1, 3, 6]
  let totalWeightSum = 0;
  const incrementalWeightSums = [];
  for (let i = 0; i < weights.length; i++) {
    totalWeightSum += weights[i];
    incrementalWeightSums.push(totalWeightSum);
  }

  // Select a random number up to the total weight sum
  // Find the first incremental weight sum that is less than the random number
  // This lets us select an item from a list with relative weighting applied
  const randomPick = Math.random() * totalWeightSum;
  for (let i = 0; i < incrementalWeightSums.length; i++) {
    if (randomPick < incrementalWeightSums[i]) {
      return list[i];
    }
  }
}

function devalueWonCells(weights, commands, cells, playerName) {
  return produce(weights, (draftWeights) => {
    commands.forEach((command, i) => {
      const [x, y] = command.slot;
      const winner = getCellWinner({ cell: cells[x][y] });
      if (winner === playerName) {
        draftWeights[i] *= 0.5;
      }
    });
  });
}

function strategyRandom(player, game) {
  const { cells } = game.board;
  const { name, inventory } = player;
  const commands = getAllPossibleCommands(cells, name, inventory);

  return pickRandom(commands);
}

function strategyAvoidWonCells(player, game) {
  const { cells } = game.board;
  const { name, inventory } = player;
  const commands = getAllPossibleCommands(cells, name, inventory);
  let weights = Array(commands.length).fill(1);
  weights = devalueWonCells(weights, commands, cells, name);

  return pickRandom(commands, weights);
}

const STRATEGIES = {
  MANUAL: "manual",
  RANDOM: "random",
  RANDOM_AVOID_WON_CELLS: "randomAvoidWonCells",
};
const STRATEGY_FUNCS = {
  [STRATEGIES.MANUAL]: () => {},
  [STRATEGIES.RANDOM]: strategyRandom,
  [STRATEGIES.RANDOM_AVOID_WON_CELLS]: strategyAvoidWonCells,
};

export { getAllPossibleCommands, STRATEGY_FUNCS, STRATEGIES };
