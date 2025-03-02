import Board from "../board";

test("initializes an empty board", () => {
  expect(new Board()).toBeInstanceOf(Board);
});

test("accepts valid command from a player", () => {
  const b = new Board();
  const command = { player: "p1", slot: [0, 0, 1] };

  expect(() => b.issueCommand(command)).not.toThrow();
  expect(b.getCellState([0, 0])).toStrictEqual([undefined, "p1", undefined]);
});

test("detects collisions with an existing piece", () => {
  const b = new Board();
  const c1 = { player: "p1", slot: [0, 0, 1] };
  const c2 = { player: "p2", slot: [0, 0, 1] };
  b.issueCommand(c1);

  expect(() => b.issueCommand(c2)).toThrow();
  expect(b.getCellState([0, 0])).toStrictEqual([undefined, "p1", undefined]);
});

test("prevents a player placing a piece in a pinned slot", () => {
  const b = new Board();
  const c1 = { player: "p1", slot: [0, 0, 1] };
  const c2 = { player: "p2", slot: [0, 0, 0] };
  b.issueCommand(c1);

  expect(() => b.issueCommand(c2)).toThrow();
  expect(b.getCellState([0, 0])).toStrictEqual([undefined, "p1", undefined]);
});

test("gets all open slots for a player on an empty board", () => {
  const b = new Board();
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
  const actualOpenSlots = b.getAllOpenSlots().sort();

  expect(actualOpenSlots.length).toBe(27);
  expect(actualOpenSlots).toStrictEqual(expectedOpenSlots);
});

test("gets all open slots for a player on an occupied board", () => {
  const b = new Board();
  b.issueCommand({ player: "p1", slot: [0, 0, 1] });
  b.issueCommand({ player: "p2", slot: [1, 0, 2] });
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
  const actualOpenSlots = b.getAllOpenSlots().sort();

  expect(actualOpenSlots.length).toBe(22);
  expect(actualOpenSlots).toStrictEqual(expectedOpenSlots);
});

test("gets all pluckable pieces for a player on an empty board", () => {
  const b = new Board();

  expect(b.getAllPluckablePieces("p1")).toStrictEqual([]);
});

test("gets all pluckable pieces for a player on an occupied board", () => {
  const b = new Board();
  b.issueCommand({ player: "p1", slot: [0, 0, 0] });
  b.issueCommand({ player: "p2", slot: [1, 0, 0] });
  b.issueCommand({ player: "p1", slot: [1, 0, 1] });
  b.issueCommand({ player: "p2", slot: [0, 1, 0] });
  b.issueCommand({ player: "p1", slot: [0, 1, 1] });
  b.issueCommand({ player: "p2", slot: [0, 1, 2] });

  expect(b.getAllPluckablePieces("p1")).toStrictEqual([
    [0, 0, 0],
    [1, 0, 1],
  ]);
  expect(b.getAllPluckablePieces("p2")).toStrictEqual([[0, 1, 2]]);
});

test("lets a player pluck a piece", () => {
  const b = new Board();
  b.issueCommand({ player: "p1", slot: [0, 0, 0] });
  b.issueCommand({ player: "p1", pluck: [0, 0, 0], slot: [1, 0, 0] });

  expect(b.getCellState([0, 0])).toStrictEqual([
    undefined,
    undefined,
    undefined,
  ]);
  expect(b.getCellState([1, 0])).toStrictEqual(["p1", undefined, undefined]);
});

test("prevents a player plucking a piece that is not theirs", () => {
  const b = new Board();
  b.issueCommand({ player: "p1", slot: [0, 0, 0] });
  const c = { player: "p2", pluck: [0, 0, 0], slot: [1, 0, 0] };

  expect(() => b.issueCommand(c)).toThrow();
  expect(b.getCellState([0, 0])).toStrictEqual(["p1", undefined, undefined]);
});

test("prevents a player plucking a piece and placing it in the wrong slot", () => {
  const b = new Board();
  b.issueCommand({ player: "p1", slot: [0, 0, 0] });
  const c = { player: "p1", pluck: [0, 0, 0], slot: [0, 0, 1] };

  expect(() => b.issueCommand(c)).toThrow();
  expect(b.getCellState([0, 0])).toStrictEqual(["p1", undefined, undefined]);
});

test("prevents a player plucking a piece that doesn't exist", () => {
  const b = new Board();
  b.issueCommand({ player: "p1", slot: [0, 0, 0] });
  const c = { player: "p1", pluck: [0, 0, 1], slot: [0, 0, 2] };

  expect(() => b.issueCommand(c)).toThrow();
  expect(b.getCellState([0, 0])).toStrictEqual(["p1", undefined, undefined]);
});

test("prevents a player plucking a piece that is pinned", () => {
  const b = new Board();
  b.issueCommand({ player: "p1", slot: [0, 0, 0] });
  b.issueCommand({ player: "p2", slot: [0, 0, 1] });
  const c = { player: "p1", pluck: [0, 0, 0], slot: [1, 0, 0] };

  expect(() => b.issueCommand(c)).toThrow();
  expect(b.getCellState([0, 0])).toStrictEqual(["p1", "p2", undefined]);
});

test("prevents a player plucking a piece into a pinned slot", () => {
  const b = new Board();
  b.issueCommand({ player: "p1", slot: [0, 0, 0] });
  b.issueCommand({ player: "p2", slot: [1, 0, 1] });
  const c = { player: "p1", pluck: [0, 0, 0], slot: [1, 0, 0] };

  expect(() => b.issueCommand(c)).toThrow();
  expect(b.getCellState([0, 0])).toStrictEqual(["p1", undefined, undefined]);
  expect(b.getCellState([1, 0])).toStrictEqual([undefined, "p2", undefined]);
});

test("checks for winner on an empty board", () => {
  const b = new Board();

  expect(b.checkForWinner()).toBe(undefined);
});

test("checks for winner on an occupied board", () => {
  const b = new Board();
  b.issueCommand({ player: "p1", slot: [0, 0, 0] });
  b.issueCommand({ player: "p2", slot: [0, 1, 0] });
  b.issueCommand({ player: "p1", slot: [0, 1, 1] });
  b.issueCommand({ player: "p1", slot: [0, 2, 1] });

  expect(b.checkForWinner()).toBe("p1");
});
