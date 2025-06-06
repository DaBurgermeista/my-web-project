import { Game } from './game.js';
import { log } from './utils.js';

const FRAGMENTS = [
  '"I remember... the sky had color once."',
  '"ERROR//data block mismatch. Reconstructing..."',
  '"Echo 7… is that you?"',
  '"They sealed us in to keep us safe. Or to forget us."'
];

export class Interactable {
  constructor(x, y, type = "fragment") {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  trigger() {
    switch (this.type) {
        case "fragment":
            const message = FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)];
            log(message, "lore");
            break;

        case "cache":
            const heal = 5;
            const current = Number(Game.player.hp) || 0;
            const max = Number(Game.player.maxHp) || 0;
            Game.player.hp = Math.min(max, current + heal);

            log(`You accessed a <span class="log-loot">Data Cache</span> and recovered <strong>${heal} HP</strong>.`, "loot");
            Game.player.updateUI();
            break;
        case "stairsDown":
            log("You descend to the next level...", "system");
            Game.nextLevel();
            break;
    }
    

    Game.display.draw(this.x, this.y, ".");
    Game.interactables = Game.interactables.filter(i => !(i.x === this.x && i.y === this.y));
  }
}
