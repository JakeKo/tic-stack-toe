import {
  calculateWinningLines,
  checkForWinner,
  createBoard,
  generateEmptyCells,
  getAllOpenSlots,
  getAllPluckablePieces,
  getBiggestPiece,
  getCellWinner,
  isSlotPinned,
  issueCommand,
} from "../board";

test("generateEmptyCells creates a 3x3 board with 3 slots", () => {
  const cells = generateEmptyCells(3, 3);
  const expectedCells = [
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
  expect(cells).toStrictEqual(expectedCells);
});

test("generateEmptyCells creates a 1x1 board with 3 slots", () => {
  const cells = generateEmptyCells(1, 3);
  const expectedCells = [[[undefined, undefined, undefined]]];
  expect(cells).toStrictEqual(expectedCells);
});

test("generateEmptyCells creates a 1x1 board with 1 slot", () => {
  const cells = generateEmptyCells(1, 1);
  const expectedCells = [[[undefined]]];
  expect(cells).toStrictEqual(expectedCells);
});

test("calculateWinningLines returns all winning lines for a 3x3 board", () => {
  const lines = calculateWinningLines(3);
  const expectedLines = [
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];
  expect(lines).toStrictEqual(expectedLines);
});

test("calculateWinningLines returns all winning lines for a 1x1 board", () => {
  const lines = calculateWinningLines(1);
  const expectedLines = [[[0, 0]]];
  expect(lines).toStrictEqual(expectedLines);
});

test("getBiggestPiece returns the largest piece in an occupied cell", () => {
  const cells = [[[undefined, "p1", undefined]]];
  const biggestPiece = getBiggestPiece({ cells, address: [0, 0] });
  expect(biggestPiece).toStrictEqual({ player: "p1", slot: [0, 0, 1] });
});

test("getBiggestPiece returns the largest piece in a really occupied cell", () => {
  const cells = [[["p2", "p1", "p2"]]];
  const biggestPiece = getBiggestPiece({ cells, address: [0, 0] });
  expect(biggestPiece).toStrictEqual({ player: "p2", slot: [0, 0, 2] });
});

test("getBiggestPiece returns no piece for an empty cell", () => {
  const cells = [[[undefined, undefined, undefined]]];
  const biggestPiece = getBiggestPiece({ cells, address: [0, 0] });
  expect(biggestPiece).toEqual(undefined);
});

test("isSlotPinned returns true for a pinned slot", () => {
  const cells = [[[undefined, "p1", undefined]]];
  expect(isSlotPinned(cells, [0, 0, 0])).toBe(true);
  expect(isSlotPinned(cells, [0, 0, 1])).toBe(false);
  expect(isSlotPinned(cells, [0, 0, 2])).toBe(false);
});

test("isSlotPinned returns false for an empty cell", () => {
  const cells = [[[undefined, undefined, undefined]]];
  expect(isSlotPinned(cells, [0, 0, 0])).toBe(false);
  expect(isSlotPinned(cells, [0, 0, 1])).toBe(false);
  expect(isSlotPinned(cells, [0, 0, 2])).toBe(false);
});

test("getCellWinner returns the player in a cell", () => {
  const cells = [[[undefined, "p1", undefined]]];
  const winner = getCellWinner({ cells, address: [0, 0] });
  expect(getCellWinner({ cells, address: [0, 0] })).toBe("p1");
  expect(getCellWinner({ cell: cells[0][0] })).toBe("p1");
});

test("getCellWinner returns the winner with multiple players in a cell", () => {
  const cells = [[[undefined, "p1", "p2"]]];
  expect(getCellWinner({ cells, address: [0, 0] })).toBe("p2");
  expect(getCellWinner({ cell: cells[0][0] })).toBe("p2");
});

test("getCellWinner returns undefined for an empty cell", () => {
  const cells = [[[undefined, undefined, undefined]]];
  expect(getCellWinner({ cells, address: [0, 0] })).toBe(undefined);
  expect(getCellWinner({ cell: cells[0][0] })).toBe(undefined);
});

test("accepts valid command from a player", () => {
  const board = createBoard();
  const command = { player: "p1", slot: [0, 0, 1] };
  let newCells;

  expect(() => (newCells = issueCommand(board.cells, command))).not.toThrow();
  expect(newCells[0][0]).toStrictEqual([undefined, "p1", undefined]);
});

test("detects collisions with an existing piece", () => {
  const board = createBoard(3, 3, [{ player: "p1", slot: [0, 0, 1] }]);
  const command = { player: "p2", slot: [0, 0, 1] };

  expect(() => issueCommand(board.cells, command)).toThrow();
});

test("prevents a player placing a piece in a pinned slot", () => {
  const board = createBoard(3, 3, [{ player: "p1", slot: [0, 0, 1] }]);
  const command = { player: "p2", slot: [0, 0, 0] };

  expect(() => issueCommand(board.cells, command)).toThrow();
});

test("getAllOpenSlots gets all slots on an empty board", () => {
  const board = createBoard();
  const expectedOpenSlots = [
    [0, 0, 0],
    [0, 0, 1],
    [0, 0, 2],
    [1, 0, 0],
    [1, 0, 1],
    [1, 0, 2],
    [2, 0, 0],
    [2, 0, 1],
    [2, 0, 2],
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 2],
    [1, 1, 0],
    [1, 1, 1],
    [1, 1, 2],
    [2, 1, 0],
    [2, 1, 1],
    [2, 1, 2],
    [0, 2, 0],
    [0, 2, 1],
    [0, 2, 2],
    [1, 2, 0],
    [1, 2, 1],
    [1, 2, 2],
    [2, 2, 0],
    [2, 2, 1],
    [2, 2, 2],
  ].sort();
  const actualOpenSlots = getAllOpenSlots(board.cells).sort();

  expect(actualOpenSlots.length).toBe(27);
  expect(actualOpenSlots).toStrictEqual(expectedOpenSlots);
});

test("getAllOpenSlots gets all open slots on an occupied board", () => {
  const board = createBoard(3, 3, [
    { player: "p1", slot: [0, 0, 1] },
    { player: "p2", slot: [1, 0, 2] },
  ]);
  const expectedOpenSlots = [
    [0, 0, 2],
    [2, 0, 0],
    [2, 0, 1],
    [2, 0, 2],
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 2],
    [1, 1, 0],
    [1, 1, 1],
    [1, 1, 2],
    [2, 1, 0],
    [2, 1, 1],
    [2, 1, 2],
    [0, 2, 0],
    [0, 2, 1],
    [0, 2, 2],
    [1, 2, 0],
    [1, 2, 1],
    [1, 2, 2],
    [2, 2, 0],
    [2, 2, 1],
    [2, 2, 2],
  ].sort();
  const actualOpenSlots = getAllOpenSlots(board.cells).sort();

  expect(actualOpenSlots.length).toBe(22);
  expect(actualOpenSlots).toStrictEqual(expectedOpenSlots);
});

test("gets all pluckable pieces for a player on an empty board", () => {
  const board = createBoard();

  expect(getAllPluckablePieces(board.cells, "p1")).toStrictEqual([]);
});

test("gets all pluckable pieces for a player on an occupied board", () => {
  const board = createBoard(3, 3, [
    { player: "p1", slot: [0, 0, 0] },
    { player: "p2", slot: [1, 0, 0] },
    { player: "p1", slot: [1, 0, 1] },
    { player: "p2", slot: [0, 1, 0] },
    { player: "p1", slot: [0, 1, 1] },
    { player: "p2", slot: [0, 1, 2] },
  ]);

  expect(getAllPluckablePieces(board.cells, "p1")).toStrictEqual([
    [0, 0, 0],
    [1, 0, 1],
  ]);
  expect(getAllPluckablePieces(board.cells, "p2")).toStrictEqual([[0, 1, 2]]);
});

test("lets a player pluck a piece", () => {
  const board = createBoard(3, 3, [{ player: "p1", slot: [0, 0, 0] }]);
  const command = { player: "p1", pluck: [0, 0, 0], slot: [1, 0, 0] };
  let newCells;

  expect(() => (newCells = issueCommand(board.cells, command))).not.toThrow();
  expect(newCells[0][0]).toStrictEqual([undefined, undefined, undefined]);
  expect(newCells[1][0]).toStrictEqual(["p1", undefined, undefined]);
});

test("prevents a player plucking a piece that is not theirs", () => {
  const board = createBoard(3, 3, [{ player: "p1", slot: [0, 0, 0] }]);
  const command = { player: "p2", pluck: [0, 0, 0], slot: [1, 0, 0] };

  expect(() => issueCommand(board.cells, command)).toThrow();
});

test("prevents a player plucking a piece and placing it in the wrong slot", () => {
  const board = createBoard(3, 3, [{ player: "p1", slot: [0, 0, 0] }]);
  const command = { player: "p1", pluck: [0, 0, 0], slot: [0, 0, 1] };

  expect(() => issueCommand(board.cells, command)).toThrow();
});

test("prevents a player plucking a piece that doesn't exist", () => {
  const board = createBoard(3, 3, [{ player: "p1", slot: [0, 0, 0] }]);
  const command = { player: "p1", pluck: [0, 0, 1], slot: [0, 0, 2] };

  expect(() => issueCommand(board.cells, command)).toThrow();
});

test("prevents a player plucking a piece that is pinned", () => {
  const board = createBoard(3, 3, [
    { player: "p1", slot: [0, 0, 0] },
    { player: "p2", slot: [0, 0, 1] },
  ]);
  const command = { player: "p1", pluck: [0, 0, 0], slot: [1, 0, 0] };

  expect(() => issueCommand(board.cells, command)).toThrow();
});

test("prevents a player plucking a piece into a pinned slot", () => {
  const board = createBoard(3, 3, [
    { player: "p1", slot: [0, 0, 0] },
    { player: "p2", slot: [1, 0, 1] },
  ]);
  const command = { player: "p1", pluck: [0, 0, 0], slot: [1, 0, 0] };

  expect(() => issueCommand(board.cells, command)).toThrow();
});

test("checks for winner on an empty board", () => {
  const board = createBoard();

  expect(checkForWinner(board.cells)).toBe(undefined);
});

test("checks for winner on an occupied board", () => {
  const board = createBoard(3, 3, [
    { player: "p1", slot: [0, 0, 0] },
    { player: "p2", slot: [0, 1, 0] },
    { player: "p1", slot: [0, 1, 1] },
    { player: "p1", slot: [0, 2, 1] },
  ]);

  expect(checkForWinner(board.cells)).toBe("p1");
});
