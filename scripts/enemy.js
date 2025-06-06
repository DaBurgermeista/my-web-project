import { ENEMY_TYPES } from "./enemyTypes.js";
import { drawTile } from "./tiles.js";
import { Game } from "./game.js";
import { log } from "./utils.js";

export class Enemy {
  constructor(x, y, type = "wraith") {
    this.x = x;
    this.y = y;
    this.type = type;

    const config = ENEMY_TYPES[type];
    if (!config) throw new Error(`Unknown enemy type: ${type}`);

    this.name = config.name;
    this.char = config.char;
    this.fg = config.fg;
    this.hp = config.maxHp;
    this.attack = config.attack ?? 1;
    this.defense = config.defense ?? 0;
    this.behavior = config.behavior;
  }

  draw() {
    drawTile(Game.display, this.x, this.y, {
      char: this.char,
      fg: this.fg,
    });
  }
  takeDamage(amount) {
    this.hp -= Number(amount);

    // Clamp at 0
    if (this.hp < 0) this.hp = 0;

    //log(`You attacked ${this.name} for ${amount} damage`, "log-combat");

    if (this.hp <= 0) {
      this.die();
    } else {
      // Optional: retaliate or animate
      log(`${this.name} took ${amount} damage.`, "log-combat");
    }
  }
  die() {
    log(`${this.name} was erased.`, "log-combat");

    // Remove from Game.enemies
    Game.enemies = Game.enemies.filter((e) => e !== this);

    // Clear display at position
    drawTile(Game.display, this.x, this.y, "floor");
  }
}
