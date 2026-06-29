import Phaser from "phaser";
import { GAME } from "../config";

// HUD: 스테이지/체력/목숨/점수. GameScene과 병렬로 실행.
export class UIScene extends Phaser.Scene {
  private stageKey = "1-1";
  private healthText!: Phaser.GameObjects.Text;
  private infoText!: Phaser.GameObjects.Text;

  constructor() {
    super("UIScene");
  }

  init(data: { stageKey?: string }) {
    this.stageKey = data.stageKey ?? "1-1";
  }

  create() {
    this.healthText = this.add.text(8, 6, "", {
      fontFamily: GAME.FONT, fontSize: "14px", color: "#ff4d4d",
    });
    this.infoText = this.add.text(GAME.WIDTH - 8, 6, "", {
      fontFamily: GAME.FONT, fontSize: "12px", color: "#ffffff",
    }).setOrigin(1, 0);
    this.refresh();
  }

  refresh() {
    const health = this.registry.get("health") ?? 5;
    const lives = this.registry.get("lives") ?? 3;
    const score = this.registry.get("score") ?? 0;
    if (this.healthText) {
      this.healthText.setText("♥".repeat(Math.max(0, health)) + "♡".repeat(Math.max(0, 5 - health)));
    }
    if (this.infoText) {
      this.infoText.setText(`스테이지 ${this.stageKey}    LIFE x${lives}    SCORE ${score}`);
    }
  }
}
