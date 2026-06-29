import Phaser from "phaser";
import { GAME } from "../config";

export class HelpScene extends Phaser.Scene {
  constructor() {
    super("HelpScene");
  }

  create() {
    this.add.image(0, 0, "menubg").setOrigin(0, 0).setAlpha(0.35);
    this.cameras.main.setBackgroundColor("#101018");

    this.add.text(GAME.WIDTH / 2, 28, "조작 방법", {
      fontFamily: GAME.FONT, fontSize: "22px", color: "#ffffff", fontStyle: "bold",
    }).setOrigin(0.5);

    const lines = [
      "← →    이동",
      "W       점프",
      "E       활공 (하강 중 누르면 천천히)",
      "R       할퀴기 공격",
      "F       파이어볼",
      "",
      "적을 물리치고 오른쪽 깃발(GOAL)에 도달하세요!",
    ];
    lines.forEach((l, i) =>
      this.add.text(40, 60 + i * 20, l, {
        fontFamily: GAME.FONT, fontSize: "13px", color: "#e0e0e0",
      })
    );

    this.add.text(GAME.WIDTH / 2, GAME.HEIGHT - 18, "Enter / Esc → 메뉴로", {
      fontFamily: GAME.FONT, fontSize: "11px", color: "#888888",
    }).setOrigin(0.5);

    const back = () => this.scene.start("MenuScene");
    this.input.keyboard!.on("keydown-ENTER", back);
    this.input.keyboard!.on("keydown-ESC", back);
  }
}
