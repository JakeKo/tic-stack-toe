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

  const { activePlayer, board, boardHistory, commandHistory } = game;
  const cmd = activePlayer.getCommand(game);
  board.cells = issueCommand(board.cells, cmd);
  boardHistory.push(board.cells);
  commandHistory.push(cmd);

  if (!cmd.pluck) {
    const pieceSize = cmd.slot[2];
    activePlayer.inventory[pieceSize]--;
    activePlayer.playedPiecesCount++;
  }

  activePlayer.turnCount++;
  game.winner = checkForWinner(game.board.cells);

  const swapper = game.activePlayer;
  game.activePlayer = game.inactivePlayer;
  game.inactivePlayer = swapper;

  return game;
}

function createGame(p1Name = "P1", p2Name = "P2") {
  const board = createBoard();
  const p1 = createPlayer(p1Name, strategyRandom);
  const p2 = createPlayer(p2Name, strategyRandom);

  return {
    activePlayer: p1,
    inactivePlayer: p2,
    board,
    boardHistory: [board.cells],
    commandHistory: [{ start: true }],
    winner: undefined,
  };
}

export { createGame, autoPlayGame, autoPlayNextMove };
