import { createMap } from "./map.js";
import { Interactable } from "./interactables.js";
import { Enemy } from "./enemy.js";
import { Player } from "./player.js";
import { TILESET, drawTile, dim } from "./tiles.js";
import { ENEMY_TYPES } from "./enemyTypes.js";
import { log } from "./utils.js";
import * as ROT from "rot-js";

export const Game = {
  display: null,
  map: {},
  player: null,
  interactables: [],
  enemies: [],
  visibleCells: new Set(),
  seenCells: new Set(),
  fov: null,
  level: 1,

  init() {
    //ROT.RNG.setSeed(1234);
    this.display = new ROT.Display({ width: 60, height: 30, fontSize: 20 });
    document.getElementById("game").appendChild(this.display.getContainer());

    this._generateMap();

    window.addEventListener("keydown", (e) => this.player.handleInput(e));
  },

  _generateMap() {
    const digger = new ROT.Map.Digger(60, 30);
    const freeCells = [];

    const mapCallback = (x, y, value) => {
      if (value === 0) {
        this.map[`${x},${y}`] = ".";
        freeCells.push({ x, y });
      } else {
        this.map[`${x},${y}`] = "#";
      }
    };

    digger.create(mapCallback);

    // Spawn player
    const { x, y } =
      freeCells[Math.floor(ROT.RNG.getUniform() * freeCells.length)];
    this.player = new Player(x, y);
    this.player.draw();

    this.fov = new ROT.FOV.PreciseShadowcasting((x, y) => {
      const key = `${x},${y}`;
      return this.map[key] === ".";
    });

    // Add 5 random data fragments
    for (let i = 0; i < 5; i++) {
      const index = Math.floor(Math.random() * freeCells.length);
      const pos = freeCells.splice(index, 1)[0]; // remove and return
      drawTile(this.display, pos.x, pos.y, "fragment");
      Game.interactables.push(new Interactable(pos.x, pos.y, "fragment"));
    }

    // Place Stairs
    const index = Math.floor(Math.random() * freeCells.length);
    const pos = freeCells.splice(index, 1)[0];
    Game.interactables.push(new Interactable(pos.x, pos.y, "stairsDown"));
    drawTile(this.display, pos.x, pos.y, "stairsDown");

    // Spawn a mix of enemies
    const types = Object.keys(ENEMY_TYPES);
    const numEnemies = 3 + this.level;
    for (let i = 0; i < numEnemies; i++) {
      const index = Math.floor(Math.random() * freeCells.length);
      const pos = freeCells.splice(index, 1)[0];
      const type = types[Math.floor(Math.random() * types.length)];
      Game.enemies.push(new Enemy(pos.x, pos.y, type));
    }

    // Add 2 healing caches
    for (let i = 0; i < 2; i++) {
      const index = Math.floor(Math.random() * freeCells.length);
      const pos = freeCells.splice(index, 1)[0];
      drawTile(this.display, pos.x, pos.y, "cache");
      Game.interactables.push(new Interactable(pos.x, pos.y, "cache"));
    }

    this._drawWholeMap();
  },

  _drawWholeMap() {
    this.display.clear();
    this.visibleCells.clear();

    this.fov.compute(this.player._x, this.player._y, 8, (x, y) => {
      const key = `${x},${y}`;
      this.visibleCells.add(key);
      this.seenCells.add(key);
    });

    for (const key in this.map) {
      const [x, y] = key.split(",").map(Number);
      const tileType = this.map[key] === "." ? "floor" : "wall";

      if (this.visibleCells.has(key)) {
        const tile = TILESET[tileType];
        this.display.draw(x, y, tile.char, tile.fg, tile.bg);
      } else if (this.seenCells.has(key)) {
        const tile = TILESET[tileType];
        const dimFG = dim(tile.fg, 0.35);
        this.display.draw(x, y, tile.char, dimFG);
      }
      // Else: don't draw anything (still dark)
    }

    // Re-draw interactables if visible
    this.interactables.forEach((i) => {
      const key = `${i.x},${i.y}`;
      if (this.visibleCells.has(key)) {
        drawTile(this.display, i.x, i.y, i.type);
      }
    });

    // Re-draw enemies if visible
    this.enemies.forEach((e) => {
      const key = `${e.x},${e.y}`;
      if (this.visibleCells.has(key)) {
        e.draw?.();
      }
    });

    this.player.draw(); // Always draw last
  },
  nextLevel() {
    this.level += 1;
    this.map = {};
    this.interactables = [];
    this.enemies = [];
    this.visibleCells.clear();
    this.seenCells.clear();

    this.display.clear();
    log(`Level ${this.level} begins...`, "log-system");

    this._generateMap();
  },
};
