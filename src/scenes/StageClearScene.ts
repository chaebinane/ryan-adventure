import Phaser from "phaser";
import { GAME } from "../config";
import { STAGES } from "../data/stages";

export class StageClearScene extends Phaser.Scene {
  private stageIndex = 0;
  private victory = false;

  constructor() {
    super("StageClearScene");
  }

  init(data: { stageIndex: number; victory: boolean }) {
    this.stageIndex = data.stageIndex;
    this.victory = data.victory;
  }

  create() {
    this.cameras.main.setBackgroundColor("#0d0d14");
    const score = this.registry.get("score") ?? 0;

    if (this.victory) {
      this.add.text(GAME.WIDTH / 2, 70, "축하합니다!", {
        fontFamily: GAME.FONT, fontSize: "26px", color: "#ffd700", fontStyle: "bold",
      }).setOrigin(0.5);
      this.add.text(GAME.WIDTH / 2, 110, "모든 스테이지 클리어!", {
        fontFamily: GAME.FONT, fontSize: "16px", color: "#ffffff",
      }).setOrigin(0.5);
      this.add.text(GAME.WIDTH / 2, 140, `최종 점수  ${score}`, {
        fontFamily: GAME.FONT, fontSize: "16px", color: "#9be29b",
      }).setOrigin(0.5);
      this.add.text(GAME.WIDTH / 2, GAME.HEIGHT - 30, "Enter → 메뉴로", {
        fontFamily: GAME.FONT, fontSize: "12px", color: "#888888",
      }).setOrigin(0.5);
      this.input.keyboard!.on("keydown-ENTER", () => this.scene.start("MenuScene"));
    } else {
      const cleared = STAGES[this.stageIndex].key;
      this.add.text(GAME.WIDTH / 2, 80, `스테이지 ${cleared} 클리어!`, {
        fontFamily: GAME.FONT, fontSize: "22px", color: "#ffd700", fontStyle: "bold",
      }).setOrigin(0.5);
      this.add.text(GAME.WIDTH / 2, 120, `점수  ${score}`, {
        fontFamily: GAME.FONT, fontSize: "16px", color: "#9be29b",
      }).setOrigin(0.5);
      this.add.text(GAME.WIDTH / 2, 150, "Enter → 다음 스테이지", {
        fontFamily: GAME.FONT, fontSize: "13px", color: "#ffffff",
      }).setOrigin(0.5);
      this.input.keyboard!.on("keydown-ENTER", () =>
        this.scene.start("GameScene", { stageIndex: this.stageIndex + 1 })
      );
      // 3초 후 자동 진행
      this.time.delayedCall(3000, () => {
        if (this.scene.isActive()) this.scene.start("GameScene", { stageIndex: this.stageIndex + 1 });
      });
    }
  }
}
