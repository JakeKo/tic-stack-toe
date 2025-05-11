import { createSlice } from "@reduxjs/toolkit";
import { createBoard } from "../engine/board";
import { createPlayer } from "../engine/player";
import { makeGameSnapshot, playNextCommand } from "../engine/game";
import { useSelector } from "react-redux";

const initialState = {
  active: false,
  p1: createPlayer("P1"),
  p2: createPlayer("P2"),
  activePlayer: undefined,
  inactivePlayer: undefined,
  board: createBoard(),
  turnCount: 0,
  snapshots: [],
  winner: undefined,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    startGame: (state) => {
      state.active = true;
      state.activePlayer = state.p1;
      state.inactivePlayer = state.p2;
      state.snapshots.push(makeGameSnapshot(state));
    },
    setGame: (state, action) => {
      Object.assign(state, action.payload);
    },
    issueCommand: (state, action) => {
      const { command } = action.payload;
      const newGame = playNextCommand(state, command);
      Object.assign(state, newGame);
    },
    resetGame: (state) => {
      state.active = false;
      state.p1 = createPlayer("P1");
      state.p2 = createPlayer("P2");
      state.activePlayer = undefined;
      state.inactivePlayer = undefined;
      state.board = createBoard();
      state.turnCount = 0;
      state.snapshots = [];
      state.winner = undefined;
    },
  },
});

function useGame() {
  return useSelector((state) => state.game);
}

function useGamePieceColor(playerName) {
  return useSelector((state) => {
    if (playerName === state.game.p1.name) {
      return "green";
    } else if (playerName === state.game.p2.name) {
      return "red";
    }

    return "grey";
  });
}

function useBoardCellColor(playerName) {
  return useSelector((state) => {
    if (playerName === state.game.p1.name) {
      return "rgba(0, 255, 0, 0.2)";
    } else if (playerName === state.game.p2.name) {
      return "rgba(255, 0, 0, 0.2)";
    }

    return "white";
  });
}

export const { startGame, setGame, resetGame, issueCommand } =
  gameSlice.actions;
export { useGame, useGamePieceColor, useBoardCellColor };
export default gameSlice.reducer;
