import { compKey, findLastIndex } from "../utils";
import BoardCell from "./BoardCell";
import BoardCellDroppable from "./BoardCellDroppable";
import GamePiece from "./GamePiece";
import GamePieceDraggable from "./GamePieceDraggable";

function BoardDisplay({ game, handleCommand }) {
  function canDragPiece(pName, slot) {
    const [x, y, i] = slot;
    const isBiggestPiece =
      findLastIndex(game.board.cells[x][y], (s) => !!s) === i;
    return (
      game.activePlayer.name === pName &&
      game.activePlayer.isManual &&
      isBiggestPiece
    );
  }

  return (
    <div className="board-display" style={{ width: "500px" }}>
      {game.board.cells.map((col, x) =>
        col.map((cell, y) => {
          // Only use a droppable cell if the player is manual
          // So cells are not droppable for a bot player/when auto-playing a game
          // It is necessary to avoid using BoardCellDroppable for auto-play
          //   because <AutoPlayer /> isn't wrapped in a <DnDProvider />
          const BoardCellComponent = game.activePlayer.isManual
            ? BoardCellDroppable
            : BoardCell;

          return (
            <BoardCellComponent
              key={compKey(x, y)}
              game={game}
              x={x}
              y={y}
              handleCommand={handleCommand}
            >
              {cell.map((pName, i) => {
                const GamePieceComponent = canDragPiece(pName, [x, y, i])
                  ? GamePieceDraggable
                  : GamePiece;
                return (
                  pName && (
                    <GamePieceComponent
                      key={compKey(x, y, i)}
                      isP1={pName === game.p1.name}
                      size={i}
                      cell={[x, y]}
                    />
                  )
                );
              })}
            </BoardCellComponent>
          );
        })
      )}
    </div>
  );
}

export default BoardDisplay;
