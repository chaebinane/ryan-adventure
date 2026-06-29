import Phaser from "phaser";
import { GAME } from "../config";
import { consume, resetAll } from "../virtualInput";

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  create() {
    resetAll();
    this.cameras.main.setBackgroundColor("#000000");
    const score = this.registry.get("score") ?? 0;

    this.add.text(GAME.WIDTH / 2, 80, "GAME OVER", {
      fontFamily: GAME.FONT, fontSize: "30px", color: "#ff3030", fontStyle: "bold",
    }).setOrigin(0.5);
    this.add.text(GAME.WIDTH / 2, 125, `점수  ${score}`, {
      fontFamily: GAME.FONT, fontSize: "16px", color: "#ffffff",
    }).setOrigin(0.5);
    this.add.text(GAME.WIDTH / 2, 165, "Enter → 다시 시작", {
      fontFamily: GAME.FONT, fontSize: "13px", color: "#aaaaaa",
    }).setOrigin(0.5);

    this.input.keyboard!.on("keydown-ENTER", () => this.restart());
  }

  private restart() {
    this.registry.set("score", 0);
    this.registry.set("lives", 3);
    this.scene.start("GameScene", { stageIndex: 0 });
  }

  update() {
    if (consume("enter")) this.restart();
  }
}
