import { checkForWinner, createBoard, issueCommand } from "./board";
import { createPlayer } from "./player";

const MAX_GAME_TURNS = 100;

function autoPlayGame(p1Name, p2Name, p1Strategy, p2Strategy) {
  const game = createGame(p1Name, p2Name, p1Strategy, p2Strategy);

  for (let i = 0; i < MAX_GAME_TURNS; i++) {
    autoPlayNextCommand(game);

    if (game.winner) {
      break;
    }
  }

  return game;
}

function makeGameSnapshot(game, command) {
  const p1 = JSON.parse(JSON.stringify(game.p1));
  const p2 = JSON.parse(JSON.stringify(game.p2));

  return {
    p1,
    p2,
    activePlayer: game.activePlayer.name === p1.name ? p1 : p2,
    inactivePlayer: game.inactivePlayer.name === p1 ? p1 : p2,
    board: JSON.parse(JSON.stringify(game.board)),
    command,
  };
}

function autoPlayNextCommand(game) {
  return playNextCommand(game, game.activePlayer.getCommand(game));
}

function playNextCommand(game, cmd) {
  if (!game || game.winner) {
    return game;
  }

  const { activePlayer, board } = game;
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

function createGame(p1Name, p2Name, p1Strategy, p2Strategy) {
  const board = createBoard();
  const p1 = createPlayer(p1Name, p1Strategy);
  const p2 = createPlayer(p2Name, p2Strategy);

  const game = {
    p1,
    p2,
    activePlayer: p1,
    inactivePlayer: p2,
    board,
    turnCount: 0,
    snapshots: [],
    winner: undefined,
  };
  game.snapshots.push(makeGameSnapshot(game));
  return game;
}

export { createGame, autoPlayGame, autoPlayNextCommand, playNextCommand };
