import {
  checkForWinner,
  createBoard,
  getAllOpenSlots,
  getAllPluckablePieces,
  issueCommand,
} from "../board";

test("accepts valid command from a player", () => {
  const b = createBoard();
  const command = { player: "p1", slot: [0, 0, 1] };

  expect(() => issueCommand(b.cells, command)).not.toThrow();
  expect(b.cells[0][0]).toStrictEqual([undefined, "p1", undefined]);
});

test("detects collisions with an existing piece", () => {
  const b = createBoard();
  const c1 = { player: "p1", slot: [0, 0, 1] };
  const c2 = { player: "p2", slot: [0, 0, 1] };
  issueCommand(b.cells, c1);

  expect(() => issueCommand(b.cells, c2)).toThrow();
  expect(b.cells[0][0]).toStrictEqual([undefined, "p1", undefined]);
});

test("prevents a player placing a piece in a pinned slot", () => {
  const b = createBoard();
  const c1 = { player: "p1", slot: [0, 0, 1] };
  const c2 = { player: "p2", slot: [0, 0, 0] };
  issueCommand(b.cells, c1);

  expect(() => issueCommand(b.cells, c2)).toThrow();
  expect(b.cells[0][0]).toStrictEqual([undefined, "p1", undefined]);
});

test("gets all open slots for a player on an empty board", () => {
  const b = createBoard();
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
  const actualOpenSlots = getAllOpenSlots(b.cells).sort();

  expect(actualOpenSlots.length).toBe(27);
  expect(actualOpenSlots).toStrictEqual(expectedOpenSlots);
});

test("gets all open slots for a player on an occupied board", () => {
  const b = createBoard();
  issueCommand(b.cells, { player: "p1", slot: [0, 0, 1] });
  issueCommand(b.cells, { player: "p2", slot: [1, 0, 2] });
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
  const actualOpenSlots = getAllOpenSlots(b.cells).sort();

  expect(actualOpenSlots.length).toBe(22);
  expect(actualOpenSlots).toStrictEqual(expectedOpenSlots);
});

test("gets all pluckable pieces for a player on an empty board", () => {
  const b = createBoard();

  expect(getAllPluckablePieces(b.cells, "p1")).toStrictEqual([]);
});

test("gets all pluckable pieces for a player on an occupied board", () => {
  const b = createBoard();
  issueCommand(b.cells, { player: "p1", slot: [0, 0, 0] });
  issueCommand(b.cells, { player: "p2", slot: [1, 0, 0] });
  issueCommand(b.cells, { player: "p1", slot: [1, 0, 1] });
  issueCommand(b.cells, { player: "p2", slot: [0, 1, 0] });
  issueCommand(b.cells, { player: "p1", slot: [0, 1, 1] });
  issueCommand(b.cells, { player: "p2", slot: [0, 1, 2] });

  expect(getAllPluckablePieces(b.cells, "p1")).toStrictEqual([
    [0, 0, 0],
    [1, 0, 1],
  ]);
  expect(getAllPluckablePieces(b.cells, "p2")).toStrictEqual([[0, 1, 2]]);
});

test("lets a player pluck a piece", () => {
  const b = createBoard();
  issueCommand(b.cells, { player: "p1", slot: [0, 0, 0] });
  issueCommand(b.cells, { player: "p1", pluck: [0, 0, 0], slot: [1, 0, 0] });

  expect(b.cells[0][0]).toStrictEqual([undefined, undefined, undefined]);
  expect(b.cells[1][0]).toStrictEqual(["p1", undefined, undefined]);
});

test("prevents a player plucking a piece that is not theirs", () => {
  const b = createBoard();
  issueCommand(b.cells, { player: "p1", slot: [0, 0, 0] });
  const c = { player: "p2", pluck: [0, 0, 0], slot: [1, 0, 0] };

  expect(() => issueCommand(b.cells, c)).toThrow();
  expect(b.cells[0][0]).toStrictEqual(["p1", undefined, undefined]);
});

test("prevents a player plucking a piece and placing it in the wrong slot", () => {
  const b = createBoard();
  issueCommand(b.cells, { player: "p1", slot: [0, 0, 0] });
  const c = { player: "p1", pluck: [0, 0, 0], slot: [0, 0, 1] };

  expect(() => issueCommand(b.cells, c)).toThrow();
  expect(b.cells[0][0]).toStrictEqual(["p1", undefined, undefined]);
});

test("prevents a player plucking a piece that doesn't exist", () => {
  const b = createBoard();
  issueCommand(b.cells, { player: "p1", slot: [0, 0, 0] });
  const c = { player: "p1", pluck: [0, 0, 1], slot: [0, 0, 2] };

  expect(() => issueCommand(b.cells, c)).toThrow();
  expect(b.cells[0][0]).toStrictEqual(["p1", undefined, undefined]);
});

test("prevents a player plucking a piece that is pinned", () => {
  const b = createBoard();
  issueCommand(b.cells, { player: "p1", slot: [0, 0, 0] });
  issueCommand(b.cells, { player: "p2", slot: [0, 0, 1] });
  const c = { player: "p1", pluck: [0, 0, 0], slot: [1, 0, 0] };

  expect(() => issueCommand(b.cells, c)).toThrow();
  expect(b.cells[0][0]).toStrictEqual(["p1", "p2", undefined]);
});

test("prevents a player plucking a piece into a pinned slot", () => {
  const b = createBoard();
  issueCommand(b.cells, { player: "p1", slot: [0, 0, 0] });
  issueCommand(b.cells, { player: "p2", slot: [1, 0, 1] });
  const c = { player: "p1", pluck: [0, 0, 0], slot: [1, 0, 0] };

  expect(() => issueCommand(b.cells, c)).toThrow();
  expect(b.cells[0][0]).toStrictEqual(["p1", undefined, undefined]);
  expect(b.cells[1][0]).toStrictEqual([undefined, "p2", undefined]);
});

test("checks for winner on an empty board", () => {
  const b = createBoard();

  expect(checkForWinner(b.cells)).toBe(undefined);
});

test("checks for winner on an occupied board", () => {
  const b = createBoard();
  issueCommand(b.cells, { player: "p1", slot: [0, 0, 0] });
  issueCommand(b.cells, { player: "p2", slot: [0, 1, 0] });
  issueCommand(b.cells, { player: "p1", slot: [0, 1, 1] });
  issueCommand(b.cells, { player: "p1", slot: [0, 2, 1] });

  expect(checkForWinner(b.cells)).toBe("p1");
});
