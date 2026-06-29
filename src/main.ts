import Phaser from "phaser";
import { GAME } from "./config";
import { BootScene } from "./scenes/BootScene";
import { MenuScene } from "./scenes/MenuScene";
import { HelpScene } from "./scenes/HelpScene";
import { GameScene } from "./scenes/GameScene";
import { UIScene } from "./scenes/UIScene";
import { StageClearScene } from "./scenes/StageClearScene";
import { GameOverScene } from "./scenes/GameOverScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  width: GAME.WIDTH,
  height: GAME.HEIGHT,
  pixelArt: true,
  backgroundColor: "#78b4e6",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    BootScene,
    MenuScene,
    HelpScene,
    GameScene,
    UIScene,
    StageClearScene,
    GameOverScene,
  ],
};

new Phaser.Game(config);
