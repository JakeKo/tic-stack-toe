const EMPTY_BOARD_STATE_STRING = "||||||||";
function listToN(n) {
  return [...Array(n).keys()];
}

function Board(stateString = EMPTY_BOARD_STATE_STRING) {
  const cells = stateString
    .split("|")
    .map((cellString) => cellString.split(","));
  const size = Math.sqrt(cells.length);

  const rowsNeededToWin = listToN(size).map((r) =>
    listToN(size).map((c) => [r, c])
  );
  const colsNeededToWin = listToN(size).map((c) =>
    listToN(size).map((r) => [r, c])
  );
  const diagsNeededToWin = [
    listToN(size).map((v) => [v, v]),
    listToN(size).map((v) => [v, size - v - 1]),
  ];
  const cellsNeededToWin = [
    ...rowsNeededToWin,
    ...colsNeededToWin,
    ...diagsNeededToWin,
  ];

  function at(row, col) {
    return cells[row * size + col];
  }

  function topPieceAt(row, col) {
    return at(row, col)[0];
  }

  function getWinnerAt(row, col) {
    const topPiece = topPieceAt(row, col);
    return topPiece === "" ? "" : topPiece.split("")[0];
  }

  function checkForWinner() {
    const winnersOfCellsNeededToWin = cellsNeededToWin
      .map((cells) => {
        const winners = new Set(cells.map((c) => getWinnerAt(...c)));
        return winners.size === 1 ? winners.values().next().value : "";
      })
      .filter((v) => v !== "");

    return winnersOfCellsNeededToWin[0] ?? false;
  }

  return {
    stateString,
    cells,
    at,
    topPieceAt,
    checkForWinner,
  };
}

export default Board;
