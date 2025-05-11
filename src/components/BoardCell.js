import { useDrop } from "react-dnd";
import { getCellWinner } from "../engine/board";
import { compKey } from "../utils";
import GamePiece from "./GamePiece";
import { issueCommand, useBoardCellColor } from "../store/game";
import { useDispatch } from "react-redux";

function BoardCell({ cell, address }) {
  const [x, y] = address;
  const cellWinner = getCellWinner({ cell });
  const cellColor = useBoardCellColor(cellWinner);
  const cellStyle = {
    gridArea: `${y + 1} / ${x + 1} / span 1 / span 1`,
    backgroundColor: cellColor,
  };
  const dispatch = useDispatch();

  const [, drop] = useDrop(() => ({
    accept: "game-piece",
    drop: (item) => {
      const { size, address, playerName } = item;
      const command = {
        player: playerName,
        slot: [x, y, size],
        pluck: address ? [...address, size] : undefined,
      };

      dispatch(issueCommand({ command }));
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
              address={address}
            />
          )
        );
      })}
    </div>
  );
}

export default BoardCell;
