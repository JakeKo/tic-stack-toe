import { createSlice } from "@reduxjs/toolkit";
import { createBoard } from "../engine/board";
import { createPlayer } from "../engine/player";
import { makeGameSnapshot } from "../engine/game";
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
      for (const [key, value] of Object.entries(action.payload)) {
        if (key in state) {
          state[key] = value;
        }
      }
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

export const { startGame, setGame, resetGame } = gameSlice.actions;
export { useGamePieceColor };
export default gameSlice.reducer;
