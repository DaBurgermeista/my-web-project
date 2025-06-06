import { Game } from './game.js';
import { log } from './utils.js';
import { TILESET, drawTile } from './tiles.js';

export class Player {
  constructor(x, y) {
    this._x = x;
    this._y = y;

    this.name = "Echo";
    this.hp = 10;
    this.maxHp = 10;
    this.energy = 5;
    this.attack = 2;
    this.defense = 1;

    this.draw();
    log(`System online. Welcome, ${this.name}.`);
    this.updateUI();
  }

  draw() {
    drawTile(Game.display, this._x, this._y, "player");
  }

  updateUI() {
    const ui = document.getElementById("ui");
    if (ui) {
      ui.innerHTML = `
      <strong>${this.name}</strong><br>
      HP: ${this.hp} / ${this.maxHp}<br>
      Energy: ${this.energy}<br>
      ATK: ${this.attack} | DEF: ${this.defense}
      `;
    }
  }

  handleInput(e) {
    const keyMap = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0]
    };

    const code = e.key;
    if (!(code in keyMap)) return;

    const [dx, dy] = keyMap[code];
    const newX = this._x + dx;
    const newY = this._y + dy;

    const key = `${newX},${newY}`;
    const tile = Game.map[key];
    if (!tile || tile === "#") return;

    const enemy = Game.enemies.find(e => e.x === newX && e.y === newY);
    if (enemy) {
      this.attackEnemy(enemy);
      return; // Stops player from moving into enemy tile
    }

    Game.display.draw(this._x, this._y, ".");
    this._x = newX;
    this._y = newY;

    Game._drawWholeMap();
    this.draw();
    this.updateUI();

    // Check for interactables
    const interaction = Game.interactables.find(i => i.x === this._x && i.y === this._y);
    if (interaction) {
      interaction.trigger();
      this.draw();
    }
  }

  attackEnemy(enemy) {
    const dmg = Number(Math.max(0, this.attack - enemy.defense));
    log(`You <span class="log-combat">attacked ${enemy.name}</span> for ${dmg} damage`, "combat");
    enemy.takeDamage(dmg);

    if(enemy.hp > 0) {
      const retaliation = Math.max(0, enemy.attack - this.defense);
      this.hp -= retaliation;
      log(`${enemy.name} <span class="log-combat">retaliated for ${retaliation}</span>`, "combat");
      if (this.hp <= 0) {
        log(`<strong>You have been erased.</strong>`, "combat");
      }
      this.updateUI();
    }
  }
}
