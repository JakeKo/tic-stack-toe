import { STRATEGIES, STRATEGY_FUNCS } from "./strategy";

// TODO: Create a player object with numSizes and numPiecesPerSize
function createPlayer(
  name,
  strategy = STRATEGIES.MANUAL,
  inventory = [2, 2, 2]
) {
  const player = {
    name,
    isManual: strategy === STRATEGIES.MANUAL,
    inventory,
    strategy,
    turnCount: 0,
    playedPiecesCount: 0,
    numSizes: 3,
    numPiecesPerSize: 2,
  };

  return player;
}

function getCommand(player, game) {
  const strategy = STRATEGY_FUNCS[player.strategy];
  return strategy(player, game);
}

export { createPlayer, getCommand };
