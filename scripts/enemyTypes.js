export const ENEMY_TYPES = {
  wraith: {
    name: "Wraith",
    char: "W",
    fg: "#f55",
    maxHp: 10,
    attack: 2,
    defense: 1,
    behavior: "aggressive"
  },
  drone: {
    name: "Drone",
    char: "d",
    fg: "#0ff",
    maxHp: 6,
    attack: 1,
    defense: 0,
    behavior: "patrol"
  },
  lurker: {
    name: "Lurker",
    char: "l",
    fg: "#8f0",
    maxHp: 4,
    attack: 3,
    defense: 0,
    behavior: "ambush"
  }
};
