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
      ? game.activePlayer.name === game.p1.name
        ? p1
        : p2
      : undefined,
    inactivePlayer: game.inactivePlayer
      ? game.inactivePlayer.name === game.p1.name
        ? p1
        : p2
      : undefined,
    board: JSON.parse(JSON.stringify(game.board)),
    command,
  };
}

// Given a command, play it on the board and update player inventories to match
// This is *the* workhorse function that plays a turn and updates game state
function playNextCommand(game, cmd) {
  if (!game || game.winner) {
    return game;
  }

  const newCells = issueCommand(game.board.cells, cmd);
  if (newCells.error) {
    console.error(newCells.message);
    return game;
  }

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
    if (newActivePlayer.name === draftGame.p1.name) {
      draftGame.p1 = newActivePlayer;
    } else if (newActivePlayer.name === draftGame.p2.name) {
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

function createGame(p1Name = "P1", p2Name = "P2", p1Strategy, p2Strategy) {
  return {
    active: false,
    p1: createPlayer(p1Name, p1Strategy),
    p2: createPlayer(p2Name, p2Strategy),
    activePlayer: undefined,
    inactivePlayer: undefined,
    board: createBoard(),
    turnCount: 0,
    snapshots: [],
    winner: undefined,
  };
}

export { createGame, autoPlayGame, playNextCommand, makeGameSnapshot };
