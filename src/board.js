const EMPTY_BOARD_STATE_STRING = "||||||||";
function listToN(n) {
  return [...Array(n).keys()];
}

function getPieceValue(piece) {
  return piece.split("")[1];
}

function Board(state = EMPTY_BOARD_STATE_STRING) {
  const cells = state
    .split("|")
    .map((cellString) => cellString.split(",").filter((v) => v !== ""));
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

  function stateString() {
    return cells.map((row) => row.join(",")).join("|");
  }

  function at(row, col) {
    return cells[row * size + col];
  }

  function topPieceAt(row, col) {
    return at(row, col)[0];
  }

  function getWinnerAt(row, col) {
    const topPiece = topPieceAt(row, col);
    return topPiece ? topPiece.split("")[0] : undefined;
  }

  function place(piece, row, col) {
    if (canPlacePieceAt(piece, row, col)) {
      cells[row * size + col].push(piece);
      cells[row * size + col].sort((a, b) =>
        getPieceValue(a) < getPieceValue(b) ? -1 : 1
      );
    }
  }

  function canPlacePieceAt(piece, row, col) {
    const newPieceValue = getPieceValue(piece);
    const currentPieceValues = new Set(at(row, col).map(getPieceValue));

    return !currentPieceValues.has(newPieceValue);
  }

  function remove(piece, row, col) {
    const pieces = at(row, col);
    const index = pieces.indexOf(piece);

    if (index !== -1) {
      cells[row * size + col].splice(index, 1);
    }
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
    size,
    stateString,
    at,
    topPieceAt,
    place,
    canPlacePieceAt,
    remove,
    checkForWinner,
  };
}

export default Board;
