import Phaser from "phaser";
import { MapObject } from "./MapObject";
import { TileMap } from "../map/TileMap";

// 원작 mapObject.Enemy 포팅: 체력/피격/무적(flinch) 처리.
export class Enemy extends MapObject {
  health = 0;
  maxHealth = 0;
  dead = false;
  damage = 0;

  protected flinching = false;
  protected flinchTimer = 0; // ms 기준
  private now = 0;

  constructor(scene: Phaser.Scene, tileMap: TileMap) {
    super(scene, tileMap);
  }

  isDead(): boolean {
    return this.dead;
  }
  getDamage(): number {
    return this.damage;
  }

  hit(damage: number) {
    if (this.dead || this.flinching) return;
    this.health -= damage;
    if (this.health < 0) this.health = 0;
    if (this.health === 0) this.dead = true;
    this.flinching = true;
    this.flinchTimer = this.now;
  }

  // time: 누적 게임 시간(ms)
  step(time: number) {
    this.now = time;
    if (this.flinching) {
      if (time - this.flinchTimer > 1000) this.flinching = false;
    }
    // 피격 시 깜빡임
    if (this.sprite) {
      if (this.flinching) {
        const elapsed = time - this.flinchTimer;
        this.sprite.setVisible(Math.floor(elapsed / 100) % 2 !== 0);
      } else {
        this.sprite.setVisible(true);
      }
    }
  }
}
