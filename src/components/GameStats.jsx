function roundDecimal(num, digits = 3) {
  const multiple = Math.pow(10, digits);
  return Math.round(num * multiple) / multiple;
}

function GameStats({ p1Wins, p2Wins }) {
  const gameCount = p1Wins + p2Wins;
  const p1WinRatio = gameCount === 0 ? 1 : p1Wins / gameCount;
  const p2WinRatio = gameCount === 0 ? 1 : p2Wins / gameCount;
  const columns = `${p1WinRatio}fr ${p2WinRatio}fr`;

  return (
    <div className="game-stats">
      <div className="win-stats" style={{ gridTemplateColumns: columns }}>
        <div className="p1-wins">
          {p1Wins} ({roundDecimal(p1WinRatio)})
        </div>
        <div className="p2-wins">
          ({roundDecimal(p2WinRatio)}) {p2Wins}
        </div>
      </div>
    </div>
  );
}

export default GameStats;
