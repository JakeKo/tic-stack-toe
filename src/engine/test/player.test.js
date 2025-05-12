import { createPlayer } from "../player";
import { STRATEGIES } from "../strategy";

test("can create a manual player", () => {
  const player = createPlayer("p1", STRATEGIES.MANUAL);
  expect(player.name).toBe("p1");
  expect(player.isManual).toBe(true);
  expect(player.strategy).toBe(STRATEGIES.MANUAL);
  expect(player.inventory).toStrictEqual([2, 2, 2]);
  expect(player.turnCount).toBe(0);
  expect(player.playedPiecesCount).toBe(0);
  expect(player.numSizes).toBe(3);
  expect(player.numPiecesPerSize).toBe(2);
});

test("can create a bot player", () => {
  const player = createPlayer("p1", STRATEGIES.RANDOM);
  expect(player.name).toBe("p1");
  expect(player.isManual).toBe(false);
  expect(player.strategy).toBe(STRATEGIES.RANDOM);
  expect(player.inventory).toStrictEqual([2, 2, 2]);
  expect(player.turnCount).toBe(0);
  expect(player.playedPiecesCount).toBe(0);
  expect(player.numSizes).toBe(3);
  expect(player.numPiecesPerSize).toBe(2);
});
