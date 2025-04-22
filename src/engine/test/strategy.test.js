import {
  checkForWinner,
  createBoard,
  issueCommand,
  toConsoleString,
} from "../board";
import { createPlayer } from "../player";
import { getAllPossibleCommands, strategyRandom } from "../strategy";

test("getAllPossibleCommands returns all possible commands on occupied board", () => {
  const board = createBoard();
  const actualCommands = getAllPossibleCommands(board.cells, "p1", [1, 1, 0]);
  expect(actualCommands.length).toStrictEqual(18);
});

test("getAllPossibleCommands returns all possible commands on empty board", () => {
  const board = createBoard();
  const player = createPlayer("p1", () => {});

  const actualCommands = getAllPossibleCommands(
    board.cells,
    player.name,
    player.inventory
  );
  expect(actualCommands.length).toBe(27);
});

test("strategyRandom can play a game", () => {
  const player = createPlayer("p1", strategyRandom);
  const board = createBoard();

  const cmd = player.getCommand({ board });
  expect(cmd).toBeDefined();
});
