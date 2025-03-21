import { createBoard } from "../board";
import Player, { getAllPossibleCommands } from "../player";

test("player has a name", () => {
  const p = new Player("p1");
  expect(p.name).toBe("p1");
});

test("getAllPossibleCommands returns all possible commands on occupied board", () => {
  const b = createBoard();
  const actualCommands = getAllPossibleCommands(b.cells, "p1", [1, 1, 0]);
  expect(actualCommands.length).toStrictEqual(18);
});

test("getAllPossibleCommands returns all possible commands on empty board", () => {
  const b = createBoard();
  const p = new Player("p1");

  const actualCommands = getAllPossibleCommands(b.cells, p.name, p.inventory);
  expect(actualCommands.length).toBe(27);
});
