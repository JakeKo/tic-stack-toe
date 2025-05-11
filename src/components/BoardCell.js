import { useDrop } from "react-dnd";
import { getCellWinner } from "../engine/board";
import { compKey } from "../utils";
import GamePiece from "./GamePiece";
import { useBoardCellColor } from "../store/game";

function BoardCell({ cell, address, handleDrop }) {
  const [x, y] = address;
  const cellWinner = getCellWinner({ cell });
  const cellColor = useBoardCellColor(cellWinner);
  const cellStyle = {
    gridArea: `${y + 1} / ${x + 1} / span 1 / span 1`,
    backgroundColor: cellColor,
  };

  const [, drop] = useDrop(() => ({
    accept: "game-piece",
    drop: (item) => {
      const { size, cell } = item;
      const payload = {
        slot: [x, y, size],
        pluck: cell ? [...cell, size] : undefined,
      };

      handleDrop(payload);
    },
  }));

  return (
    <div ref={drop} className="cell" style={cellStyle}>
      {cell.map((playerName, i) => {
        return (
          playerName && (
            <GamePiece
              key={compKey(x, y, i)}
              playerName={playerName}
              size={i}
              cell={[x, y]}
            />
          )
        );
      })}
    </div>
  );
}

export default BoardCell;
