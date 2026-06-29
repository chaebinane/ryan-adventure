import Phaser from "phaser";
import { GAME } from "../config";

// 에셋 로드 + 스프라이트 프레임/애니메이션 정의 후 메뉴로 이동.
export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // 로딩 바
    const w = GAME.WIDTH, h = GAME.HEIGHT;
    const bar = this.add.graphics();
    const txt = this.add.text(w / 2, h / 2 - 20, "로딩 중...", {
      fontFamily: GAME.FONT, fontSize: "16px", color: "#ffffff",
    }).setOrigin(0.5);
    this.load.on("progress", (p: number) => {
      bar.clear();
      bar.fillStyle(0xffffff, 1);
      bar.fillRect(w / 2 - 80, h / 2, 160 * p, 8);
    });
    this.load.on("complete", () => { bar.destroy(); txt.destroy(); });

    // 이미지
    this.load.image("player", "assets/player/playersprites.png");
    this.load.image("fireball", "assets/player/fireball.png");
    this.load.image("slugger", "assets/enemies/slugger.png");
    this.load.image("explosion", "assets/enemies/explosion.png");
    this.load.image("grasstileset", "assets/tilesets/grasstileset.png");
    this.load.image("grassbg1", "assets/backgrounds/grassbg1.png");
    this.load.image("menubg", "assets/backgrounds/menubg.png");

    // 맵 텍스트
    this.load.text("map_1-1", "assets/maps/level1-1.map");
    this.load.text("map_1-2", "assets/maps/level1-2.map");
    this.load.text("map_1-3", "assets/maps/level1-3.map");
  }

  create() {
    this.defineTilesetFrames();
    this.definePlayerFrames();
    this.defineOtherFrames();
    this.defineAnimations();
    this.scene.start("MenuScene");
  }

  private defineTilesetFrames() {
    const TS = GAME.TILE_SIZE;
    const tex = this.textures.get("grasstileset");
    const cols = Math.floor(tex.getSourceImage().width / TS);
    const total = cols * 2;
    for (let i = 0; i < total; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      tex.add(String(i), 0, c * TS, r * TS, TS, TS);
    }
  }

  private definePlayerFrames() {
    const TS = 30;
    const tex = this.textures.get("player");
    const add = (name: string, x: number, y: number, w: number) =>
      tex.add(name, 0, x, y, w, TS);
    // 행: idle(2) walk(8) jump(1) fall(2) glide(4) fire(2) scratch(5, 폭60)
    for (let j = 0; j < 2; j++) add(`p_idle${j}`, j * TS, 0 * TS, TS);
    for (let j = 0; j < 8; j++) add(`p_walk${j}`, j * TS, 1 * TS, TS);
    add(`p_jump0`, 0 * TS, 2 * TS, TS);
    for (let j = 0; j < 2; j++) add(`p_fall${j}`, j * TS, 3 * TS, TS);
    for (let j = 0; j < 4; j++) add(`p_glide${j}`, j * TS, 4 * TS, TS);
    for (let j = 0; j < 2; j++) add(`p_fire${j}`, j * TS, 5 * TS, TS);
    for (let j = 0; j < 5; j++) add(`p_scr${j}`, j * TS * 2, 6 * TS, TS * 2); // 폭 60
  }

  private defineOtherFrames() {
    const TS = 30;
    const sl = this.textures.get("slugger");
    for (let j = 0; j < 3; j++) sl.add(`s${j}`, 0, j * TS, 0, TS, TS);
    const ex = this.textures.get("explosion");
    for (let j = 0; j < 6; j++) ex.add(`e${j}`, 0, j * TS, 0, TS, TS);
    const fb = this.textures.get("fireball");
    for (let j = 0; j < 4; j++) fb.add(`fb${j}`, 0, j * TS, 0, TS, TS);
    for (let j = 0; j < 3; j++) fb.add(`fbh${j}`, 0, j * TS, TS, TS, TS);
  }

  private defineAnimations() {
    const A = (key: string, tex: string, frames: string[], frameRate: number, repeat: number) => {
      this.anims.create({
        key,
        frames: frames.map((f) => ({ key: tex, frame: f })),
        frameRate,
        repeat,
      });
    };
    A("player_idle", "player", ["p_idle0", "p_idle1"], 2.5, -1);
    A("player_walk", "player", ["p_walk0","p_walk1","p_walk2","p_walk3","p_walk4","p_walk5","p_walk6","p_walk7"], 25, -1);
    A("player_jump", "player", ["p_jump0"], 1, -1);
    A("player_fall", "player", ["p_fall0", "p_fall1"], 10, -1);
    A("player_glide", "player", ["p_glide0","p_glide1","p_glide2","p_glide3"], 10, -1);
    A("player_fire", "player", ["p_fire0", "p_fire1"], 10, 0);
    A("player_scratch", "player", ["p_scr0","p_scr1","p_scr2","p_scr3","p_scr4"], 20, 0);

    A("slugger_walk", "slugger", ["s0", "s1", "s2"], 3.3, -1);
    A("explosion", "explosion", ["e0","e1","e2","e3","e4","e5"], 14, 0);
    A("fireball_move", "fireball", ["fb0","fb1","fb2","fb3"], 14, -1);
    A("fireball_hit", "fireball", ["fbh0","fbh1","fbh2"], 14, 0);
  }
}
