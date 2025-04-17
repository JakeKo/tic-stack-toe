import {
  checkForWinner,
  createBoard,
  getAllOpenSlots,
  getAllPluckablePieces,
  getCellsColumnWise,
  getCellsRowWise,
  issueCommand,
} from "../board";

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

test("gets all open slots for a player on an empty board", () => {
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

test("gets all open slots for a player on an occupied board", () => {
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

test("gets cells column-wise", () => {
  const board = createBoard(2, 2, [
    { player: "p1", slot: [0, 0, 0] },
    { player: "p2", slot: [0, 1, 0] },
  ]);
  const { indices } = getCellsColumnWise(board.cells);

  expect(indices).toStrictEqual([
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ]);
});

test("gets cells row-wise", () => {
  const board = createBoard(2, 2, [
    { player: "p1", slot: [0, 0, 0] },
    { player: "p2", slot: [0, 1, 0] },
  ]);
  const { indices } = getCellsRowWise(board.cells);

  expect(indices).toStrictEqual([
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ]);
});
