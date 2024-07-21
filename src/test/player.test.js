import Player from "../player";

test("checks if a player has a piece", () => {
  const p = new Player();

  expect(p.has(0)).toBe(true);
  expect(p.has(1)).toBe(true);
  expect(p.has(2)).toBe(true);
  expect(p.has(3)).toBe(false);
});

test("removes a piece from a player's inventory", () => {
  const p = new Player();
  p.pullPieceFromInventory(0);
  p.pullPieceFromInventory(0);

  expect(p.has(0)).toBe(false);
});

test("checks if player is out of pieces", () => {
  const p = new Player();

  expect(p.isOutOfPieces()).toBe(false);

  p.pullPieceFromInventory(0);
  p.pullPieceFromInventory(0);
  p.pullPieceFromInventory(1);
  p.pullPieceFromInventory(1);
  p.pullPieceFromInventory(2);
  p.pullPieceFromInventory(2);

  expect(p.isOutOfPieces()).toBe(true);
});
