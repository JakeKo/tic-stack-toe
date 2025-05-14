import { useEffect } from "react";
import PlayerDisplay from "../components/PlayerDisplay";
import BoardDisplay from "../components/BoardDisplay";
import { useGame } from "../store/game";
import GameDialogs from "../components/GameDialogs";
import { getCommand } from "../engine/player";
import Layout from "./Layout";

function ManualPlayer() {
  const { game, issueCommand, configurePlayerDetails } = useGame();

  useEffect(() => {
    const { activePlayer: p } = game;

    if (p && !p.isManual) {
      setTimeout(() => {
        const command = getCommand(p, game);
        issueCommand({ command });
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.activePlayer]);

  return (
    <Layout>
      <div className="game-container">
        <div className="player-display-container" style={{ gridArea: "1 / 1" }}>
          <PlayerDisplay
            player={game.p1}
            isActive={game.activePlayer?.name === game.p1.name}
            isConfiguring={!game.active}
            configurePlayerDetails={configurePlayerDetails}
          />
        </div>
        <GameDialogs />
        <BoardDisplay cells={game.board.cells} />
        <div className="player-display-container" style={{ gridArea: "1 / 3" }}>
          <PlayerDisplay
            player={game.p2}
            isActive={game.activePlayer?.name === game.p2.name}
            isConfiguring={!game.active}
            configurePlayerDetails={configurePlayerDetails}
          />
        </div>
      </div>
    </Layout>
  );
}

export default ManualPlayer;
