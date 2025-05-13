import { produce } from "immer";
import { findLastIndex, nArray } from "../utils";

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
  const linesSet = new Set();

  // Generate winning rows
  for (let j = 0; j < size; j++) {
    const row = nArray(size).map((i) => [i, j]);
    linesSet.add(JSON.stringify(row));
  }

  // Generate winning columns
  for (let i = 0; i < size; i++) {
    const col = nArray(size).map((j) => [i, j]);
    linesSet.add(JSON.stringify(col));
  }

  // Generate winning diagonals
  const diagonal1 = nArray(size).map((i) => [i, i]);
  const diagonal2 = nArray(size).map((i) => [i, size - i - 1]);
  linesSet.add(JSON.stringify(diagonal1));
  linesSet.add(JSON.stringify(diagonal2));

  return [...linesSet].map((line) => JSON.parse(line));
}

function getBiggestPiece({ cells = undefined, address, cell = undefined }) {
  const [x, y] = address;
  const finalCell = cells ? cells[x][y] : cell;

  const biggestPieceIndex = findLastIndex(finalCell, (slot) => !!slot);
  const biggestPiecePlayer = finalCell[biggestPieceIndex];
  return biggestPiecePlayer
    ? {
        player: biggestPiecePlayer,
        slot: [x, y, biggestPieceIndex],
      }
    : undefined;
}

// This function checks if a slot is pinned, meaning that there are larger pieces in the same cell
function isSlotPinned(cells, [x, y, i]) {
  const cell = cells[x][y];
  const biggerPieces = cell.slice(i + 1);
  return biggerPieces.some((piece) => !!piece);
}

function getCellWinner({ cells, address, cell }) {
  const finalCell = cells ? cells[address[0]][address[1]] : cell;
  const biggestPieceIndex = findLastIndex(finalCell, (slot) => !!slot);
  return finalCell[biggestPieceIndex];
}

function BoardError(message) {
  return { error: true, message };
}

function issueCommand(cells, command) {
  const { player, pluck, slot } = command;
  const [placeX, placeY, placeI] = slot;
  const cell = cells[placeX][placeY];

  if (pluck) {
    const [pluckX, pluckY, pluckI] = pluck;
    const pluckCell = cells[pluckX][pluckY];

    if (pluckI !== placeI) {
      return BoardError(`Trying to place the wrong piece in slot ${slot}`);
    } else if (isSlotPinned(cells, pluck)) {
      return BoardError(`Piece plucked from pinned slot ${slot}`);
    } else if (pluckCell[pluckI] !== player) {
      return BoardError(`Piece plucked from the wrong player ${pluck}`);
    }
  }

  if (cell[placeI]) {
    return BoardError(`Slot ${slot} is already occupied`);
  }

  // Checks for any larger pieces in the current cell and rejects the move
  if (isSlotPinned(cells, slot)) {
    return BoardError(`Slot ${slot} is pinned`);
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
    const lineOwners = line.map((address) => getCellWinner({ cells, address }));
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
    const winner = getCellWinner({ cells: board.cells, address: [x, y] });
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
  calculateWinningLines,
  getBiggestPiece,
};
