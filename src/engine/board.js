import { produce } from "immer";
import { findLastIndex } from "../utils";

function generateEmptyCells(size, slotCount) {
  const cells = [];

  for (let x = 0; x < size; x++) {
    const col = [];

    for (let y = 0; y < size; y++) {
      col.push(Array(slotCount).fill(undefined));
    }

    cells.push(col);
  }

  return cells;
}

function calculateWinningLines(size) {
  const lines = [];

  // Generate winning rows
  for (let j = 0; j < size; j++) {
    const row = [...Array(size)].map((_, i) => [i, j]);
    lines.push(row);
  }

  // Generate winning columns
  for (let i = 0; i < size; i++) {
    const col = [...Array(size)].map((_, j) => [i, j]);
    lines.push(col);
  }

  // Generate winning diagonals
  const diagonal1 = [...Array(size)].map((_, i) => [i, i]);
  const diagonal2 = [...Array(size)].map((_, i) => [i, size - i - 1]);
  lines.push(diagonal1);
  lines.push(diagonal2);

  return lines;
}

function isSlotPinned(cells, slot) {
  const [x, y, i] = slot;
  const cell = cells[x][y];

  for (let j = i + 1; j < cell.length; j++) {
    if (cell[j]) {
      return true;
    }
  }

  return false;
}

function getCellWinner(cells, [x, y]) {
  const cell = cells[x][y];
  const lastIndex = findLastIndex(cell, (slot) => !!slot);
  return lastIndex === -1 ? undefined : cell[lastIndex];
}

function issueCommand(cells, command) {
  const { player, pluck, slot } = command;
  const [placeX, placeY, placeI] = slot;
  const cell = cells[placeX][placeY];

  if (pluck) {
    const [pluckX, pluckY, pluckI] = pluck;
    const pluckCell = cells[pluckX][pluckY];

    if (pluckI !== placeI) {
      throw new Error(`Trying to place the wrong piece in slot ${slot}`);
    } else if (isSlotPinned(cells, pluck)) {
      throw new Error(`Piece plucked from pinned slot ${pluck}`);
    } else if (pluckCell[pluckI] !== player) {
      throw new Error(`Piece plucked from the wrong player ${pluck}`);
    }
  }

  if (cell[placeI]) {
    throw new Error(`Piece collision in slot ${slot}`);
  }

  // Checks for any larger pieces in the current cell and rejects the move
  if (isSlotPinned(cells, slot)) {
    throw new Error(`Piece placed in a pinned slot ${slot}`);
  }

  return produce(cells, (draftCells) => {
    draftCells[placeX][placeY][placeI] = player;

    if (pluck) {
      const [pluckX, pluckY, pluckI] = pluck;
      draftCells[pluckX][pluckY][pluckI] = undefined;
    }
  });
}

function getAllOpenSlots(cells) {
  const openSlots = [];
  for (let x = 0; x < cells.length; x++) {
    for (let y = 0; y < cells[x].length; y++) {
      const cell = cells[x][y];
      const lastOpenSlotIndex = findLastIndex(cell, (p) => !!p) + 1;

      for (let i = lastOpenSlotIndex; i < cell.length; i++) {
        openSlots.push([x, y, i]);
      }
    }
  }

  return openSlots;
}

function getAllPluckablePieces(cells, player) {
  const pluckablePieces = [];

  for (let x = 0; x < cells.length; x++) {
    for (let y = 0; y < cells[x].length; y++) {
      // Iterate through the cell backwards to find the largest piece that belongs to the player
      const cell = cells[x][y];
      const lastIndex = findLastIndex(cell, (slot) => !!slot);
      if (lastIndex !== -1 && cell[lastIndex] === player) {
        pluckablePieces.push([x, y, lastIndex]);
      }
    }
  }

  return pluckablePieces;
}

function checkForWinner(cells) {
  const winningLines = calculateWinningLines(cells.length);

  // Iterate over all winning lines and check if there is a winner
  for (let i = 0; i < winningLines.length; i++) {
    const line = winningLines[i];
    const lineOwners = line.map((cell) => getCellWinner(cells, cell));
    const uniqueLineOwners = [...new Set(lineOwners)];

    // If there is exactly one owner for the line, then that owner is the winner
    // uniqueLineOwners[0] will be undefined if the line is empty
    if (uniqueLineOwners.length === 1) {
      return uniqueLineOwners[0];
    }
  }

  return undefined;
}

function inferPlayerNamesFromBoard(cells) {
  const players = new Set();

  cells.forEach((col) => {
    col.forEach((cell) => {
      cell.forEach((slot) => {
        if (slot) {
          players.add(slot);
        }
      });
    });
  });

  return [...players];
}

function toConsoleString(board) {
  const playerNames = inferPlayerNamesFromBoard(board.cells);
  const maxPlayerNameLength = Math.max(...playerNames.map((p) => p.length));
  const placeholder = "_".repeat(maxPlayerNameLength);

  function getCellColor([x, y]) {
    const winner = getCellWinner(board.cells, [x, y]);
    if (winner) {
      return winner === playerNames[0] ? "\u001b[31m" : "\u001b[32m";
    } else {
      return "\u001b[0m";
    }
  }

  // We swap y into the outer for loop here because we need to iterate row-wise
  // Storing things as cells[x][y] means we would normally iterate column-wise
  let s = "";
  for (let y = 0; y < board.size; y++) {
    for (let x = 0; x < board.size; x++) {
      const cell = board.cells[x][y];
      const color = getCellColor([x, y]);
      s +=
        color +
        cell.map((slot) => slot ?? placeholder).join(" ") +
        "\u001b[0m" +
        " | ";
    }

    s += "\n";
  }

  return s;
}

function toPlaintextString(board) {
  const playerNames = inferPlayerNamesFromBoard(board.cells);
  const maxPlayerNameLength = Math.max(...playerNames.map((p) => p.length));
  const placeholder = "_".repeat(maxPlayerNameLength);

  // We swap y into the outer for loop here because we need to iterate row-wise
  // Storing things as cells[x][y] means we would normally iterate column-wise
  let s = "";
  for (let y = 0; y < board.size; y++) {
    for (let x = 0; x < board.size; x++) {
      const cell = board.cells[x][y];
      s += cell.map((slot) => slot ?? placeholder).join(" ") + " | ";
    }

    s += "\n";
  }

  return s;
}

function createBoard(size = 3, slotCount = 3, state = []) {
  const cells = state.reduce(
    (cells, command) =>
      produce(cells, (draftCells) => {
        const [x, y, i] = command.slot;
        draftCells[x][y][i] = command.player;
      }),
    generateEmptyCells(size, slotCount)
  );

  return { cells, size, slotCount };
}

export {
  createBoard,
  issueCommand,
  getAllOpenSlots,
  getAllPluckablePieces,
  checkForWinner,
  getCellWinner,
  isSlotPinned,
  generateEmptyCells,
  toConsoleString,
  toPlaintextString,
};
