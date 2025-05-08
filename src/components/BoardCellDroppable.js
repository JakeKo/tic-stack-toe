import { useDrop } from "react-dnd";
import { getCellWinner } from "../engine/board";
import { cellColorGenerator } from "../utils";

function BoardCellDroppable({ game, x, y, handleCommand, children }) {
  const [, drop] = useDrop(() => ({
    accept: "game-piece",
    drop: (item) => {
      const slot = [x, y, item.size];
      const player = game.activePlayer.name;
      const command = { player, slot };
      handleCommand(command);
    },
  }));
  const cellColor = cellColorGenerator(game.p1.name, game.p2.name);

  function getCellStyle(x, y) {
    const winner = getCellWinner(game.board.cells, [x, y]);
    return {
      gridArea: `${y + 1} / ${x + 1} / span 1 / span 1`,
      backgroundColor: cellColor(winner),
    };
  }

  return (
    <div ref={drop} className="cell" style={getCellStyle(x, y)}>
      {children}
    </div>
  );
}

export default BoardCellDroppable;
