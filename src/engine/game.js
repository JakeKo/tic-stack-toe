import { checkForWinner, createBoard, issueCommand } from "./board";
import { createPlayer } from "./player";
import { strategyRandom } from "./strategy";

const MAX_GAME_TURNS = 100;

function autoPlayGame(p1Name = "P1", p2Name = "P2") {
  const game = createGame(p1Name, p2Name);

  for (let i = 0; i < MAX_GAME_TURNS; i++) {
    autoPlayNextMove(game);

    if (game.winner) {
      break;
    }
  }

  return game;
}

function autoPlayNextMove(game) {
  if (!game || game.winner) {
    return game;
  }

  const activePlayer = game.activePlayer === game.p1.name ? game.p1 : game.p2;
  const cmd = activePlayer.getCommand(game);
  game.board.cells = issueCommand(game.board.cells, cmd);
  game.boardHistory.push(game.board.cells);
  game.commandHistory.push(cmd);

  if (!cmd.pluck) {
    const pieceSize = cmd.slot[2];
    activePlayer.inventory[pieceSize]--;
    if (activePlayer.name === game.p1.name) {
      game.p1PlayedPiecesCount++;
    } else {
      game.p2PlayedPiecesCount++;
    }
  }

  if (activePlayer.name === game.p1.name) {
    game.p1TurnCount++;
    game.activePlayer = game.p2.name;
  } else {
    game.p2TurnCount++;
    game.activePlayer = game.p1.name;
  }

  game.winner = checkForWinner(game.board.cells);
  return game;
}

function createGame(p1Name = "P1", p2Name = "P2") {
  const board = createBoard();
  const p1 = createPlayer(p1Name, strategyRandom);
  const p2 = createPlayer(p2Name, strategyRandom);

  return {
    p1,
    p2,
    activePlayer: p1Name,
    board,
    boardHistory: [board.cells],
    p1TurnCount: 0,
    p2TurnCount: 0,
    p1PlayedPiecesCount: 0,
    p2PlayedPiecesCount: 0,
    commandHistory: [{ start: true }],
    winner: undefined,
  };
}

export { createGame, autoPlayGame, autoPlayNextMove };
