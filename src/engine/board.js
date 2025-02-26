// EMPTY_CELLS acts like a const but needs to be function
// Otherwise each new board is created with the _same instance_ of EMPTY_CELLS
// Curse you, passing by reference *shakes fists skyward*
function EMPTY_CELLS() {
  return [
    [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ],
    [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ],
    [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ],
  ];
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

class Board {
  constructor() {
    this._cells = EMPTY_CELLS();
  }

  // Checks if there are any pieces larger than the current slot
  // This is useful to know if a player can place/pluck a piece in that slot
  _isSlotPinned(slot) {
    const [x, y, i] = slot;
    const cell = this._cells[x][y];

    for (let j = i + 1; j < cell.length; j++) {
      if (cell[j]) {
        return true;
      }
    }

    return false;
  }

  issueCommand(command) {
    const { player, pluck, slot } = command;
    const [placeX, placeY, placeI] = slot;
    const cell = this._cells[placeX][placeY];

    if (pluck) {
      const [pluckX, pluckY, pluckI] = pluck;
      const pluckCell = this._cells[pluckX][pluckY];

      if (pluckI !== placeI) {
        throw new Error(`Trying to place the wrong piece in slot ${slot}`);
      } else if (this._isSlotPinned(pluck)) {
        throw new Error(`Piece plucked from pinned slot ${pluck}`);
      } else if (pluckCell[pluckI] !== player) {
        throw new Error(`Piece plucked from the wrong player ${pluck}`);
      }
    }

    if (cell[placeI]) {
      throw new Error(`Piece collision in slot ${slot}`);
    }

    // Checks for any larger pieces in the current cell and rejects the move
    if (this._isSlotPinned(slot)) {
      throw new Error(`Piece placed in a pinned slot ${slot}`);
    }

    cell[placeI] = player;
    if (pluck) {
      const [pluckX, pluckY, pluckI] = pluck;
      const pluckCell = this._cells[pluckX][pluckY];
      pluckCell[pluckI] = undefined;
    }
  }

  getCellState([x, y]) {
    return this._cells[x][y];
  }

  getAllOpenSlots() {
    const openSlots = [];
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        const cell = this._cells[x][y];
        const lastOpenSlotIndex = findLastIndex(cell, (p) => !!p) + 1;

        for (let i = lastOpenSlotIndex; i < 3; i++) {
          openSlots.push([x, y, i]);
        }
      }
    }

    return openSlots;
  }

  getAllPluckablePieces(player) {
    const pluckablePieces = [];
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let i = 2; i >= 0; i--) {
          const slot = this._cells[x][y][i];
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
}

export default Board;
