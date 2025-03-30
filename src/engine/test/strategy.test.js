import {
  checkForWinner,
  createBoard,
  issueCommand,
  toVisualString,
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
  const player = createPlayer("p1");

  const actualCommands = getAllPossibleCommands(
    board.cells,
    player.name,
    player.inventory
  );
  expect(actualCommands.length).toBe(27);
});

test("strategyRandom can play a game", () => {
  let board = createBoard();
  const p1 = createPlayer("p1");
  const p2 = createPlayer("p2");

  for (let i = 0; i < 10; i++) {
    const cmd1 = strategyRandom(p1, board.cells);
    board.cells = issueCommand(board.cells, cmd1);

    if (!cmd1.pluck) {
      const pieceSize = cmd1.slot[2];
      p1.inventory[pieceSize]--;
    }

    const cmd2 = strategyRandom(p2, board.cells);
    board.cells = issueCommand(board.cells, cmd2);

    if (!cmd2.pluck) {
      const pieceSize = cmd2.slot[2];
      p2.inventory[pieceSize]--;
    }

    const winner = checkForWinner(board.cells);
    console.log(
      [
        `${cmd1.slot} ${cmd1.pluck ?? "     "} ${p1.inventory}`,
        `${cmd2.slot} ${cmd2.pluck ?? "     "} ${p2.inventory}`,
        toVisualString(board),
        winner ? `Winner: ${winner}` : "",
      ].join("\n")
    );
  }
});
