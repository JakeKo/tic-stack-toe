import {
  checkForWinner,
  createBoard,
  getAllOpenSlots,
  getAllPluckablePieces,
  issueCommand,
} from "./board";
import { createPlayer } from "./player";

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

function playGame(p1Name = "P1", p2Name = "P2") {
  let board = createBoard();
  let p1TurnCount = 0;
  let p2TurnCount = 0;
  let p1PlayedPiecesCount = 0;
  let p2PlayedPiecesCount = 0;
  const p1 = createPlayer(p1Name);
  const p2 = createPlayer(p2Name);

  for (let i = 0; i < 100; i++) {
    const cmd1 = strategyRandom(p1, board.cells);
    board.cells = issueCommand(board.cells, cmd1);

    if (!cmd1.pluck) {
      const pieceSize = cmd1.slot[2];
      p1.inventory[pieceSize]--;
      p1PlayedPiecesCount++;
    }

    p1TurnCount++;
    if (checkForWinner(board.cells)) {
      break;
    }

    const cmd2 = strategyRandom(p2, board.cells);
    board.cells = issueCommand(board.cells, cmd2);

    if (!cmd2.pluck) {
      const pieceSize = cmd2.slot[2];
      p2.inventory[pieceSize]--;
      p2PlayedPiecesCount++;
    }

    p2TurnCount++;
    if (checkForWinner(board.cells)) {
      break;
    }
  }

  return {
    board,
    p1TurnCount,
    p2TurnCount,
    p1PlayedPiecesCount,
    p2PlayedPiecesCount,
    winner: checkForWinner(board.cells),
  };
}

export { getAllPossibleCommands, strategyRandom, playGame };
