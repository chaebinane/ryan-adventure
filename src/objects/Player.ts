import Phaser from "phaser";
import { MapObject } from "./MapObject";
import { Enemy } from "./Enemy";
import { FireBall } from "./FireBall";
import { TileMap } from "../map/TileMap";
import { CharacterStats } from "../data/characters";

export interface PlayerInput {
  left: boolean;   // 누르고 있음
  right: boolean;  // 누르고 있음
  glide: boolean;  // 누르고 있음
  jump: boolean;   // 이번 스텝에 새로 눌림(원샷)
  scratch: boolean;
  fire: boolean;
}

// 원작 mapObject.Player 포팅.
export class Player extends MapObject {
  health: number;
  maxHealth: number;
  dead = false;

  private flinching = false;
  private flinchTimer = 0;
  private now = 0;

  private gliding = false;
  private scratching = false;
  private firing = false;
  private scratchDamage: number;
  private scratchRange: number;
  private fireBallDamage: number;
  private fireBalls: FireBall[] = [];

  private currentAnim = "";

  constructor(scene: Phaser.Scene, tileMap: TileMap, stats: CharacterStats) {
    super(scene, tileMap);
    this.box = 20;
    this.moveSpeed = stats.moveSpeed;
    this.maxSpeed = stats.maxSpeed;
    this.stopSpeed = 0.4;
    this.fallSpeed = 0.15;
    this.maxFallSpeed = 4.0;
    this.jumpStart = stats.jumpStart;
    this.stopJumpSpeed = 0.3;
    this.facingRight = true;
    this.health = this.maxHealth = stats.maxHealth;
    this.scratchDamage = stats.scratchDamage;
    this.scratchRange = stats.scratchRange;
    this.fireBallDamage = stats.fireBallDamage;
    this.imageWidth = 30;
    this.imageHeight = 30;

    this.sprite = scene.add.sprite(0, 0, stats.spriteKey).setDepth(7);
    this.sprite.play("player_idle");
    this.currentAnim = "player_idle";
    this.sprite.on("animationcomplete", (anim: Phaser.Animations.Animation) => {
      if (anim.key === "player_scratch") this.scratching = false;
      if (anim.key === "player_fire") this.firing = false;
    });
  }

  step(input: PlayerInput, time: number) {
    this.now = time;
    this.keySetting(input);
    this.getNextPosition();
    this.checkTileMapCollision();
    this.updateAnimation();
    this.updateFireBalls();
    this.renderFlinch(time);
    this.syncSprite();
  }

  private keySetting(input: PlayerInput) {
    this.right = input.right;
    this.left = input.left;
    this.gliding = input.glide;
    if (input.jump) this.jumping = true;
    if (input.scratch && !this.scratching) this.scratching = true;
    if (input.fire && !this.firing) this.firing = true;
  }

  private getNextPosition() {
    if (this.left) {
      this.dx -= this.moveSpeed;
      if (this.dx < -this.maxSpeed) this.dx = -this.maxSpeed;
    } else if (this.right) {
      this.dx += this.moveSpeed;
      if (this.dx > this.maxSpeed) this.dx = this.maxSpeed;
    } else {
      if (this.dx > 0) {
        this.dx -= this.stopSpeed;
        if (this.dx < 0) this.dx = 0;
      } else if (this.dx < 0) {
        this.dx += this.stopSpeed;
        if (this.dx > 0) this.dx = 0;
      }
    }

    if (this.jumping && !this.falling) {
      this.dy = this.jumpStart;
      this.falling = true;
    }
    if (this.falling) {
      if (this.dy > 0 && this.gliding) this.dy += this.fallSpeed * 0.1;
      else this.dy += this.fallSpeed;
      if (this.dy > 0) this.jumping = false;
      if (this.dy < 0 && !this.jumping) this.dy += this.stopJumpSpeed;
      if (this.dy > this.maxFallSpeed) this.dy = this.maxFallSpeed;
    }
  }

  private playAnim(key: string) {
    if (this.currentAnim !== key) {
      this.currentAnim = key;
      this.sprite.play(key);
    }
  }

  private updateAnimation() {
    if (this.scratching) {
      this.playAnim("player_scratch");
    } else if (this.firing) {
      if (this.currentAnim !== "player_fire") {
        // 파이어볼 생성(원작: 발사 애니메이션 진입 시)
        const fb = new FireBall(this.scene, this.tileMap, this.facingRight, this.x, this.y);
        this.fireBalls.push(fb);
      }
      this.playAnim("player_fire");
    } else if (this.dy > 0) {
      if (this.gliding) this.playAnim("player_glide");
      else this.playAnim("player_fall");
    } else if (this.dy < 0) {
      this.playAnim("player_jump");
    } else if (this.left || this.right) {
      this.playAnim("player_walk");
    } else {
      this.playAnim("player_idle");
    }

    if (this.right) this.facingRight = true;
    if (this.left) this.facingRight = false;
  }

  private updateFireBalls() {
    for (let i = 0; i < this.fireBalls.length; i++) {
      this.fireBalls[i].step();
      if (this.fireBalls[i].isRemove()) {
        this.fireBalls[i].destroy();
        this.fireBalls.splice(i, 1);
        i--;
      }
    }
  }

  private renderFlinch(time: number) {
    if (this.flinching) {
      if (time - this.flinchTimer > 1000) this.flinching = false;
      const elapsed = time - this.flinchTimer;
      this.sprite.setVisible(Math.floor(elapsed / 100) % 2 !== 0);
    } else {
      this.sprite.setVisible(true);
    }
  }

  checkAttack(enemyList: Enemy[]) {
    for (const e of enemyList) {
      if (this.intersects(e)) this.hit(e.getDamage());

      if (this.scratching) {
        if (this.facingRight) {
          if (e.x > this.x && e.x < this.x + this.scratchRange &&
              e.y > this.y - this.box / 2 && e.y < this.y + this.box / 2) {
            e.hit(this.scratchDamage);
          }
        } else {
          if (e.x < this.x && e.x > this.x - this.scratchRange &&
              e.y > this.y - this.box / 2 && e.y < this.y + this.box / 2) {
            e.hit(this.scratchDamage);
          }
        }
      }

      for (const fb of this.fireBalls) {
        if (fb.intersects(e)) {
          e.hit(this.fireBallDamage);
          fb.setHit();
          break;
        }
      }
    }
  }

  hit(damage: number) {
    if (this.flinching) return;
    this.health -= damage;
    if (this.health <= 0) {
      this.health = 0;
      this.dead = true;
      return;
    }
    this.flinching = true;
    this.flinchTimer = this.now;
  }

  destroy() {
    this.fireBalls.forEach((f) => f.destroy());
    super.destroy();
  }
}
