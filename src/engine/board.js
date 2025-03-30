import { produce } from "immer";

function generateEmptyCells(size, slotCount) {
  const cells = [];

  for (let i = 0; i < size; i++) {
    const row = [];

    for (let j = 0; j < size; j++) {
      row.push(Array(slotCount).fill(undefined));
    }

    cells.push(row);
  }

  return cells;
}

function generateWinningLines(size) {
  const lines = [];

  // Generate winning rows
  for (let i = 0; i < size; i++) {
    const row = [...Array(size)].map((_, j) => [i, j]);
    lines.push(row);
  }

  // Generate winning columns
  for (let j = 0; j < size; j++) {
    const column = [...Array(size)].map((_, i) => [i, j]);
    lines.push(column);
  }

  // Generate winning diagonals
  const diagonal1 = [...Array(size)].map((_, i) => [i, i]);
  const diagonal2 = [...Array(size)].map((_, i) => [i, size - i - 1]);
  lines.push(diagonal1);
  lines.push(diagonal2);

  return lines;
}

function findLastIndex(list, searchFunc) {
  let i = list.length - 1;
  for (i; i >= 0; i--) {
    if (searchFunc(list[i])) {
      return i;
    }
  }

  return i;
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

  for (let i = cell.length - 1; i >= 0; i--) {
    const slot = cell[i];
    if (slot) {
      return slot;
    }
  }

  return undefined;
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
      for (let i = cells[x][y].length - 1; i >= 0; i--) {
        const slot = cells[x][y][i];

        if (slot) {
          if (slot === player) {
            pluckablePieces.push([x, y, i]);
          }

          break;
        }
      }
    }
  }

  return pluckablePieces;
}

function checkForWinner(cells) {
  const winningLines = generateWinningLines(cells.length);

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

function toVisualString(board) {
  function inferPlayerNamesFromBoard(cells) {
    const players = new Set();

    cells.forEach((row) => {
      row.forEach((cell) => {
        cell.forEach((slot) => {
          if (slot) {
            players.add(slot);
          }
        });
      });
    });

    return [...players];
  }

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

  return board.cells
    .map((row, x) =>
      row
        .map((cell, y) => {
          const color = getCellColor([x, y]);

          return (
            color +
            cell.map((slot) => slot ?? placeholder).join(" ") +
            "\u001b[0m"
          );
        })
        .join(" | ")
    )
    .join("\n");
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

  return { cells };
}

export {
  createBoard,
  issueCommand,
  getAllOpenSlots,
  getAllPluckablePieces,
  checkForWinner,
  generateWinningLines,
  getCellWinner,
  isSlotPinned,
  generateEmptyCells,
  toVisualString,
};
