import Phaser from "phaser";
import { GAME } from "../config";
import { TileMap } from "../map/TileMap";
import { Player, PlayerInput } from "../objects/Player";
import { Enemy } from "../objects/Enemy";
import { Slugger } from "../objects/Slugger";
import { Explosion } from "../objects/Explosion";
import { STAGES } from "../data/stages";
import { CHARACTERS } from "../data/characters";
import { vinput, consume, resetAll } from "../virtualInput";

export class GameScene extends Phaser.Scene {
  private tileMap!: TileMap;
  private player!: Player;
  private enemies: Enemy[] = [];
  private explosions: Explosion[] = [];
  private stageIndex = 0;
  private goalX = 0;
  private state: "play" | "dead" | "clear" = "play";
  private gameMs = 0;
  private accumulator = 0;

  // 입력 키
  private keyLeft!: Phaser.Input.Keyboard.Key;
  private keyRight!: Phaser.Input.Keyboard.Key;
  private keyGlide!: Phaser.Input.Keyboard.Key;
  private keyJump!: Phaser.Input.Keyboard.Key;
  private keyScratch!: Phaser.Input.Keyboard.Key;
  private keyFire!: Phaser.Input.Keyboard.Key;

  constructor() {
    super("GameScene");
  }

  init(data: { stageIndex?: number }) {
    this.stageIndex = data.stageIndex ?? 0;
    this.enemies = [];
    this.explosions = [];
    this.state = "play";
    this.gameMs = 0;
    this.accumulator = 0;
  }

  create() {
    resetAll();
    const stage = STAGES[this.stageIndex];

    // 배경(고정 하늘)
    this.add.image(0, 0, stage.bg).setOrigin(0, 0).setScrollFactor(0).setDepth(-10);

    // 타일맵
    const mapText = this.cache.text.get(stage.mapKey);
    this.tileMap = new TileMap(this, "grasstileset", mapText);

    // 플레이어
    this.player = new Player(this, this.tileMap, CHARACTERS.ryan);
    this.player.setPosition(stage.playerStart.x, stage.playerStart.y);
    this.player.syncSprite();

    // 적
    for (const e of stage.enemies) {
      if (e.type === "slugger") {
        this.enemies.push(new Slugger(this, this.tileMap, e.x, e.y));
      }
    }

    // 골인 지점(맵 오른쪽 끝)
    this.goalX = this.tileMap.worldWidth - GAME.TILE_SIZE * 2;
    this.drawGoal();

    // 카메라
    this.cameras.main.setBounds(0, 0, this.tileMap.worldWidth, GAME.HEIGHT);
    this.cameras.main.setRoundPixels(true);
    this.cameras.main.startFollow(this.player.sprite, true, 0.15, 0.15);

    // 입력
    const kb = this.input.keyboard!;
    this.keyLeft = kb.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.keyRight = kb.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.keyGlide = kb.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.keyJump = kb.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyScratch = kb.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.keyFire = kb.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    // HUD (병렬 실행)
    this.scene.launch("UIScene", { stageKey: stage.key });
    this.scene.bringToTop("UIScene");

    // 레지스트리 초기값 보정
    if (this.registry.get("lives") === undefined) this.registry.set("lives", 3);
    if (this.registry.get("score") === undefined) this.registry.set("score", 0);
    this.syncHud();
  }

  private drawGoal() {
    const g = this.add.graphics().setDepth(3);
    const x = this.goalX;
    g.fillStyle(0xffffff, 1);
    g.fillRect(x, 0, 4, GAME.HEIGHT);          // 깃대
    g.fillStyle(0xff3030, 1);
    g.fillTriangle(x + 4, 20, x + 4, 56, x + 40, 38); // 깃발
    this.add.text(x - 4, 60, "GOAL", {
      fontFamily: GAME.FONT, fontSize: "12px", color: "#ffffff",
    }).setDepth(3);
  }

  update(_time: number, delta: number) {
    if (this.state !== "play") return;

    const step = GAME.PHYSICS_STEP_MS;
    this.accumulator += Math.min(delta, 100); // 큰 끊김 방지

    const heldInput = {
      left: this.keyLeft.isDown || vinput.left,
      right: this.keyRight.isDown || vinput.right,
      glide: this.keyGlide.isDown || vinput.glide,
    };
    // consume()는 항상 호출되어야 큐가 비워지므로 JustDown과 분리해 평가한다.
    const jumpKey = Phaser.Input.Keyboard.JustDown(this.keyJump);
    const jumpTouch = consume("jump");
    const scratchKey = Phaser.Input.Keyboard.JustDown(this.keyScratch);
    const scratchTouch = consume("scratch");
    const fireKey = Phaser.Input.Keyboard.JustDown(this.keyFire);
    const fireTouch = consume("fire");
    const jumpPressed = jumpKey || jumpTouch;
    const scratchPressed = scratchKey || scratchTouch;
    const firePressed = fireKey || fireTouch;
    let firstStep = true;

    while (this.accumulator >= step) {
      this.accumulator -= step;
      this.gameMs += step;

      const input: PlayerInput = {
        ...heldInput,
        jump: firstStep && jumpPressed,
        scratch: firstStep && scratchPressed,
        fire: firstStep && firePressed,
      };
      firstStep = false;

      this.player.step(input, this.gameMs);
      this.player.checkAttack(this.enemies);
      this.updateEnemies();

      if (this.player.dead || this.player.y + this.player.box >= GAME.HEIGHT) {
        this.handleDeath();
        return;
      }
      if (this.player.x >= this.goalX) {
        this.handleClear();
        return;
      }
    }

    this.updateExplosions();
    this.syncHud();
  }

  private updateEnemies() {
    for (let i = 0; i < this.enemies.length; i++) {
      const e = this.enemies[i];
      e.step(this.gameMs);
      if (e.isDead()) {
        this.explosions.push(new Explosion(this, this.tileMap, e.x, e.y));
        e.destroy();
        this.enemies.splice(i, 1);
        i--;
        this.registry.set("score", (this.registry.get("score") ?? 0) + 100);
      }
    }
  }

  private updateExplosions() {
    for (let i = 0; i < this.explosions.length; i++) {
      if (this.explosions[i].isRemove()) {
        this.explosions[i].destroy();
        this.explosions.splice(i, 1);
        i--;
      }
    }
  }

  private syncHud() {
    const ui = this.scene.get("UIScene") as Phaser.Scene & { setData?: Function };
    this.registry.set("health", this.player.health);
    (ui as any).refresh?.();
  }

  private handleDeath() {
    this.state = "dead";
    const lives = (this.registry.get("lives") ?? 3) - 1;
    this.registry.set("lives", lives);
    this.cameras.main.fade(700, 0, 0, 0);
    this.time.delayedCall(800, () => {
      if (lives > 0) {
        this.scene.restart({ stageIndex: this.stageIndex });
      } else {
        this.scene.stop("UIScene");
        this.scene.start("GameOverScene");
      }
    });
  }

  private handleClear() {
    this.state = "clear";
    this.registry.set("score", (this.registry.get("score") ?? 0) + 500);
    const isLast = this.stageIndex >= STAGES.length - 1;
    this.cameras.main.fade(700, 255, 255, 255);
    this.time.delayedCall(800, () => {
      this.scene.stop("UIScene");
      this.scene.start("StageClearScene", {
        stageIndex: this.stageIndex,
        victory: isLast,
      });
    });
  }
}
