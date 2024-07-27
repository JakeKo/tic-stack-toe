import Player from "../player";

test("checks if a player has a piece", () => {
  const p = new Player("a");

  expect(p.has("a0")).toBe(true);
  expect(p.has("a1")).toBe(true);
  expect(p.has("a2")).toBe(true);
  expect(p.has("a3")).toBe(false);
});

test("removes a piece from a player's inventory", () => {
  const p = new Player("a");
  p.pullPieceFromInventory("a0");
  p.pullPieceFromInventory("a0");

  expect(p.has("a0")).toBe(false);
});

test("checks if player is out of pieces", () => {
  const p = new Player("a");

  expect(p.isOutOfPieces()).toBe(false);

  p.pullPieceFromInventory("a0");
  p.pullPieceFromInventory("a0");
  p.pullPieceFromInventory("a1");
  p.pullPieceFromInventory("a1");
  p.pullPieceFromInventory("a2");
  p.pullPieceFromInventory("a2");

  expect(p.isOutOfPieces()).toBe(true);
});
