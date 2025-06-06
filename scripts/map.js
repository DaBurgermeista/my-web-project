export function createMap(width, height) {
  const map = new ROT.Map.Digger(width, height);
  const cells = {};
  map.create((x, y, value) => {
    if (value === 0) {
      cells[`${x},${y}`] = ".";
    }
  });
  return cells;
}
