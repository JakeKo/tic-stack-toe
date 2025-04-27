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

function makeGameSnapshot(game, command) {
  const p1 = { ...game.p1 };
  const p2 = { ...game.p2 };

  return {
    p1,
    p2,
    activePlayer: game.activePlayer.name === p1.name ? p1 : p2,
    inactivePlayer: game.inactivePlayer.name === p1 ? p1 : p2,
    board: game.board,
    command,
  };
}

function autoPlayNextMove(game) {
  if (!game || game.winner) {
    return game;
  }

  const { activePlayer, board } = game;
  const cmd = activePlayer.getCommand(game);
  board.cells = issueCommand(board.cells, cmd);

  if (!cmd.pluck) {
    const pieceSize = cmd.slot[2];
    activePlayer.inventory[pieceSize]--;
    activePlayer.playedPiecesCount++;
  }

  activePlayer.turnCount++;
  game.turnCount++;
  game.winner = checkForWinner(game.board.cells);
  game.snapshots.push(makeGameSnapshot(game, cmd));

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
    p1,
    p2,
    activePlayer: p1,
    inactivePlayer: p2,
    board,
    turnCount: 0,
    snapshots: [],
    winner: undefined,
  };
}

export { createGame, autoPlayGame, autoPlayNextMove };
