import { current, produce } from "immer";
import { checkForWinner, createBoard, issueCommand } from "./board";
import { createPlayer, getCommand } from "./player";

const MAX_GAME_TURNS = 100;

function autoPlayGame(p1Name, p2Name, p1Strategy, p2Strategy) {
  let game = createGame(p1Name, p2Name, p1Strategy, p2Strategy);

  for (let i = 0; i < MAX_GAME_TURNS; i++) {
    const { activePlayer: p } = game;
    const command = getCommand(p, game);
    game = playNextCommand(game, command);

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
    activePlayer: game.activePlayer
      ? isP1(game.activePlayer, game)
        ? p1
        : p2
      : undefined,
    inactivePlayer: game.inactivePlayer
      ? isP1(game.inactivePlayer, game)
        ? p1
        : p2
      : undefined,
    board: JSON.parse(JSON.stringify(game.board)),
    command,
  };
}

function isP1(player, game) {
  return player.name === game.p1.name;
}

function isP2(player, game) {
  return player.name === game.p2.name;
}

function playNextCommand(game, cmd) {
  if (!game || game.winner) {
    return game;
  }

  const newCells = issueCommand(game.board.cells, cmd);
  const newGame = produce(game, (draftGame) => {
    draftGame.board.cells = newCells;
    const newActivePlayer = produce(game.activePlayer, (activePlayer) => {
      if (!cmd.pluck) {
        const pieceSize = cmd.slot[2];
        activePlayer.inventory[pieceSize]--;
        activePlayer.playedPiecesCount++;
      }

      activePlayer.turnCount++;
    });

    draftGame.activePlayer = newActivePlayer;
    if (isP1(newActivePlayer, draftGame)) {
      draftGame.p1 = newActivePlayer;
    } else if (isP2(newActivePlayer, draftGame)) {
      draftGame.p2 = newActivePlayer;
    }

    draftGame.turnCount++;
    draftGame.winner = checkForWinner(newCells);
    if (draftGame.winner) {
      draftGame.activePlayer = undefined;
      draftGame.inactivePlayer = undefined;
    }

    draftGame.snapshots.push(makeGameSnapshot(current(draftGame), cmd));

    const swapper = draftGame.activePlayer;
    draftGame.activePlayer = draftGame.inactivePlayer;
    draftGame.inactivePlayer = swapper;
  });

  return newGame;
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

export {
  createGame,
  autoPlayGame,
  playNextCommand,
  makeGameSnapshot,
  isP1,
  isP2,
};
