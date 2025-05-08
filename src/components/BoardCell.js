import { getCellWinner } from "../engine/board";
import { cellColorGenerator } from "../utils";

function BoardCell({ game, x, y, children }) {
  const cellColor = cellColorGenerator(game.p1.name, game.p2.name);

  function getCellStyle(x, y) {
    const winner = getCellWinner(game.board.cells, [x, y]);
    return {
      gridArea: `${y + 1} / ${x + 1} / span 1 / span 1`,
      backgroundColor: cellColor(winner),
    };
  }

  return (
    <div className="cell" style={getCellStyle(x, y)}>
      {children}
    </div>
  );
}

export default BoardCell;
