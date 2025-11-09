import { compKey } from "../engine/utils";
import BoardCell from "./BoardCell";

function BoardDisplay({ cells }) {
  return (
    <div className="board-display" style={{ width: "500px" }}>
      {cells.map((col, x) =>
        col.map((cell, y) => {
          return <BoardCell key={compKey(x, y)} cell={cell} address={[x, y]} />;
        })
      )}
    </div>
  );
}

export default BoardDisplay;
