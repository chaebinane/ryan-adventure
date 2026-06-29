import Phaser from "phaser";
import { GAME, COLORS } from "../config";
import { consume, resetAll } from "../virtualInput";

// 원작 stage.StageMenu 포팅 + 완성도 보강.
export class MenuScene extends Phaser.Scene {
  private options = ["시작", "도움말", "끝"];
  private currentChoice = 0;
  private optionTexts: Phaser.GameObjects.Text[] = [];

  constructor() {
    super("MenuScene");
  }

  create() {
    resetAll();
    this.add.image(0, 0, "menubg").setOrigin(0, 0);

    this.add.text(GAME.WIDTH / 2, 64, "라이몽의 모험", {
      fontFamily: GAME.FONT, fontSize: "28px", color: COLORS.title, fontStyle: "bold",
    }).setOrigin(0.5);

    this.optionTexts = this.options.map((opt, i) =>
      this.add.text(GAME.WIDTH / 2, 130 + i * 24, opt, {
        fontFamily: GAME.FONT, fontSize: "18px", color: COLORS.unselected,
      }).setOrigin(0.5)
    );
    this.updateHighlight();

    this.add.text(GAME.WIDTH / 2, GAME.HEIGHT - 16, "↑ ↓ 이동   Enter 선택", {
      fontFamily: GAME.FONT, fontSize: "11px", color: "#333333",
    }).setOrigin(0.5);

    const kb = this.input.keyboard!;
    kb.on("keydown-DOWN", () => this.move(1));
    kb.on("keydown-UP", () => this.move(-1));
    kb.on("keydown-ENTER", () => this.select());
  }

  update() {
    if (consume("up")) this.move(-1);
    if (consume("down")) this.move(1);
    if (consume("enter")) this.select();
  }

  private move(dir: number) {
    this.currentChoice = (this.currentChoice + dir + this.options.length) % this.options.length;
    this.updateHighlight();
  }

  private updateHighlight() {
    this.optionTexts.forEach((t, i) => {
      t.setColor(i === this.currentChoice ? COLORS.selected : COLORS.unselected);
      t.setScale(i === this.currentChoice ? 1.15 : 1);
    });
  }

  private select() {
    if (this.currentChoice === 0) {
      // 새 게임: 점수/목숨 초기화
      this.registry.set("score", 0);
      this.registry.set("lives", 3);
      this.scene.start("GameScene", { stageIndex: 0 });
    } else if (this.currentChoice === 1) {
      this.scene.start("HelpScene");
    } else {
      // 웹에서는 종료 대신 안내
      this.add.text(GAME.WIDTH / 2, GAME.HEIGHT - 36, "브라우저 탭을 닫아 종료하세요", {
        fontFamily: GAME.FONT, fontSize: "11px", color: "#800000",
      }).setOrigin(0.5);
    }
  }
}
