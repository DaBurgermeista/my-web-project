export const TILESET = {
  floor: {
    char: "·",
    fg: "#444",
    bg: "#000",
  },
  wall: {
    char: "#",
    fg: "#888888",
    bg: "#000000",
  },
  cache: {
    char: "+",
    fg: "#0f0",
    bg: "#000",
  },
  fragment: {
    char: "*",
    fg: "#ff0",
    bg: "#000",
  },
  enemy: {
    char: "E",
    fg: "#f55",
    bg: "#000",
  },
  player: {
    char: "@",
    fg: "#0ff",
    bg: "#000",
  },
  stairsDown: {
    char: ">",
    fg: "#ccc",
    bg: "#000"
  },
  stairsUp: {
    char: "<",
    fg: "#ccc",
    bg: "#000"
  }
};

export function drawTile(display, x, y, type) {
  const tile = typeof type === "string" ? TILESET[type] : type;
  if (!tile) return; // fail-safe

  display.draw(x, y, tile.char, tile.fg, tile.bg ?? "#000");
}


export function dim(hex, percent = 0.5) {
  // Remove "#" if present
  hex = hex.replace("#", "");

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Darken each component
  const newR = Math.floor(r * percent);
  const newG = Math.floor(g * percent);
  const newB = Math.floor(b * percent);

  // Convert back to hex and pad if needed
  const toHex = (val) => val.toString(16).padStart(2, "0");

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}
