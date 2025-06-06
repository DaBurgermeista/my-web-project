import { Game } from './game.js';
import * as ROT from 'rot-js';

const display = new ROT.Display();
document.body.appendChild(display.getContainer());

document.addEventListener("DOMContentLoaded", () => {
  Game.init();
});
