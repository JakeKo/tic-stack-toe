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

    console.log(piece, row, col);
    validMove = board.canPlacePieceAt(piece, row, col);
  }

  return { piece, row, col };
}

function playGame() {
  const board = new Board();
  const playerA = new Player("a");
  const playerB = new Player("b");
  let winner,
    gameOver = false;

  while (!gameOver) {
    const { piece, row, col } = randomStrategy(board, playerA);
    playerA.pullPieceFromInventory(piece);
    board.place(piece, row, col);

    winner = board.checkForWinner();
    gameOver = winner ? true : false;

    if (playerB.isOutOfPieces()) {
      gameOver = true;
    }

    if (!gameOver) {
      const { piece, row, col } = randomStrategy(board, playerB);
      playerB.pullPieceFromInventory(piece);
      board.place(piece, row, col);

      winner = board.checkForWinner();
      gameOver = winner ? true : false;
    }

    if (playerA.isOutOfPieces()) {
      gameOver = true;
    }
  }

  return winner;
}

export { playGame };
