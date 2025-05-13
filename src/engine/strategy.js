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

function pickRandom(list, weights) {
  if (list.length === 0) {
    return;
  }

  if (!weights) {
    weights = Array(list.length).fill(1);
  }

  let runningWeight = 0;
  const runningWeights = [];
  for (let i = 0; i < weights.length; i++) {
    runningWeight += weights[i];
    runningWeights.push(runningWeight);
  }

  const randomPick = Math.random() * runningWeight;
  for (let i = 0; i < runningWeights.length; i++) {
    if (randomPick < runningWeights[i]) {
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
