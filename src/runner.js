import Board from "./board";
import Player from "./player";

function randomStrategy(board, player) {
  let piece,
    row,
    col,
    validMove = false;

  while (!validMove) {
    piece = player.getRandomPiece();
    row = Math.round(Math.random() * (board.size - 1));
    col = Math.round(Math.random() * (board.size - 1));

    validMove = board.canPlacePieceAt(player.name + piece, row, col);
  }

  return { piece, row, col };
}

function playGame() {
  const board = new Board();
  const playerA = new Player(3, "a");
  const playerB = new Player(3, "b");
  let winner,
    gameOver = false;

  while (!gameOver) {
    const { piece, row, col } = randomStrategy(board, playerA);
    playerA.pullPieceFromInventory(piece);
    board.place(playerA.name + piece, row, col);

    winner = board.checkForWinner();
    gameOver = winner ? true : false;

    if (!gameOver) {
      const { piece, row, col } = randomStrategy(board, playerB);
      playerB.pullPieceFromInventory(piece);
      board.place(playerB.name + piece, row, col);

      winner = board.checkForWinner();
      gameOver = winner ? true : false;
    }
  }

  return winner;
}

export { playGame };
