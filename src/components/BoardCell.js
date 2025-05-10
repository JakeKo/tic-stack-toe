import { useDrop } from "react-dnd";
import { getCellWinner } from "../engine/board";
import { cellColorGenerator } from "../utils";

function BoardCell({ game, x, y, handleCommand, children }) {
  const [, drop] = useDrop(() => ({
    accept: "game-piece",
    drop: (item) => {
      const { size, cell } = item;
      const slot = [x, y, size];
      const player = game.activePlayer.name;
      const command = { player, slot };

      if (cell) {
        command.pluck = [...cell, size];
      }

      handleCommand(command);
    },
  }));

  const cellWinner = getCellWinner(game.board.cells, [x, y]);
  const cellColor = cellColorGenerator(game.p1.name, game.p2.name);
  const cellStyle = {
    gridArea: `${y + 1} / ${x + 1} / span 1 / span 1`,
    backgroundColor: cellColor(cellWinner),
  };

  return (
    <div ref={drop} className="cell" style={cellStyle}>
      {children}
    </div>
  );
}

export default BoardCell;
