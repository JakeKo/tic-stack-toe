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

  issueCommand(command) {
    const {
      player,
      piece,
      cell: [x, y],
    } = command;

    const cell = this._cells[x][y];
    if (cell[piece]) {
      throw new Error(`Piece collision in cell [${x}, ${y}]`);
    }

    cell[piece] = player;
  }

  getCellState([x, y]) {
    return this._cells[x][y];
  }

  getAllOpenSlots(player) {
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
}

export default Board;
