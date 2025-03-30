import { createPlayer } from "../player";

test("player has a name", () => {
  const player = createPlayer("p1");
  expect(player.name).toBe("p1");
  expect(player.inventory).toStrictEqual([2, 2, 2]);
});
