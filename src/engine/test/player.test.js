import Board from "../board";
import Player, { getAllPossibleCommands } from "../player";

test("player has a name", () => {
  const p = new Player("p1");
  expect(p.name).toBe("p1");
});

test("getAllPossibleCommands returns all possible commands on occupied board", () => {
  const b = {
    getAllOpenSlots: jest.fn(() => [
      [1, 0, 0],
      [0, 0, 1],
    ]),
    getAllPluckablePieces: jest.fn(() => [[0, 0, 0]]),
  };

  const expectedCommands = [
    { player: "p1", pluck: [0, 0, 0], slot: [1, 0, 0] },
    { player: "p1", slot: [1, 0, 0] },
    { player: "p1", slot: [0, 0, 1] },
  ];
  const actualCommands = getAllPossibleCommands(b, "p1", [1, 1, 0]);
  expect(actualCommands).toStrictEqual(expectedCommands);
});

test("getAllPossibleCommands returns all possible commands on empty board", () => {
  const b = new Board();
  const p = new Player("p1");

  const actualCommands = getAllPossibleCommands(b, p.name, p.inventory);
  expect(actualCommands.length).toBe(27);
});
