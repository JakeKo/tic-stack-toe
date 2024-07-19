import Board from "../board";

test("initializes an empty board", () => {
  const b = new Board();

  expect(b.stateString()).toBe("||||||||");
  expect(b.at(0, 1)).toStrictEqual([]);
});

test("initializes a board with one move", () => {
  const b = new Board("|a0|||||||");

  expect(b.stateString()).toBe("|a0|||||||");
  expect(b.at(0, 1)).toStrictEqual(["a0"]);
});

test("initializes a board with multiple moves", () => {
  const b = new Board("|b1,a0|||b2|||a2|");

  expect(b.stateString()).toBe("|b1,a0|||b2|||a2|");
  expect(b.at(0, 1)).toStrictEqual(["b1", "a0"]);
  expect(b.at(1, 1)).toStrictEqual(["b2"]);
  expect(b.at(2, 1)).toStrictEqual(["a2"]);
});

test("gets top piece in a cell", () => {
  const b = new Board("|b1,a0|||b2|||a2|");

  expect(b.stateString()).toBe("|b1,a0|||b2|||a2|");
  expect(b.topPieceAt(0, 1)).toBe("b1");
  expect(b.topPieceAt(0, 2)).toBe(undefined);
  expect(b.topPieceAt(1, 1)).toBe("b2");
});

test("accurately determines no board winner", () => {
  const b = new Board("a0|a1|b0|b1|||||");

  expect(b.checkForWinner()).toBe(false);
});

test("accurately determines board winner", () => {
  const b = new Board("a0|a1|a2||||||");

  expect(b.checkForWinner()).toBe("a");
});

test("places a piece", () => {
  const b = new Board();
  b.place("a0", 0, 0);

  expect(b.stateString()).toBe("a0||||||||");
});

test("does not place a conflicting piece", () => {
  const b = new Board("a0||||||||");
  b.place("a0", 0, 0);

  expect(b.stateString()).toBe("a0||||||||");
});

test("removes a piece", () => {
  const b = new Board("a0||||||||");
  b.remove("a0", 0, 0);

  expect(b.stateString()).toBe("||||||||");
});
