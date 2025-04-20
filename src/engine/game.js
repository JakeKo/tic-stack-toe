import { checkForWinner, createBoard, issueCommand } from "./board";
import { createPlayer } from "./player";
import { strategyRandom } from "./strategy";

const MAX_GAME_TURNS = 100;

function autoPlayGame(p1Name = "P1", p2Name = "P2") {
  const game = createGame();
  const p1 = createPlayer(p1Name);
  const p2 = createPlayer(p2Name);

  for (let i = 0; i < MAX_GAME_TURNS; i++) {
    const cmd1 = strategyRandom(p1, game.board.cells);
    game.board.cells = issueCommand(game.board.cells, cmd1);
    game.commands.push(cmd1);

    if (!cmd1.pluck) {
      const pieceSize = cmd1.slot[2];
      p1.inventory[pieceSize]--;
      game.p1PlayedPiecesCount++;
    }

    game.p1TurnCount++;
    if ((game.winner = checkForWinner(game.board.cells))) {
      break;
    }

    const cmd2 = strategyRandom(p2, game.board.cells);
    game.board.cells = issueCommand(game.board.cells, cmd2);
    game.commands.push(cmd2);

    if (!cmd2.pluck) {
      const pieceSize = cmd2.slot[2];
      p2.inventory[pieceSize]--;
      game.p2PlayedPiecesCount++;
    }

    game.p2TurnCount++;
    if ((game.winner = checkForWinner(game.board.cells))) {
      break;
    }
  }

  return game;
}

function createGame() {
  const board = createBoard();

  return {
    board,
    boardHistory: [board],
    p1TurnCount: 0,
    p2TurnCount: 0,
    p1PlayedPiecesCount: 0,
    p2PlayedPiecesCount: 0,
    commands: [],
    winner: undefined,
  };
}

export { createGame, autoPlayGame };
