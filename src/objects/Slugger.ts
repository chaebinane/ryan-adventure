import Phaser from "phaser";
import { Enemy } from "./Enemy";
import { TileMap } from "../map/TileMap";

// 원작 enemy.Slugger 포팅: 좌우로 걷다가 벽에 닿으면 방향 전환.
export class Slugger extends Enemy {
  constructor(scene: Phaser.Scene, tileMap: TileMap, x: number, y: number) {
    super(scene, tileMap);
    this.imageWidth = 30;
    this.imageHeight = 30;
    this.moveSpeed = 0.3;
    this.maxSpeed = 0.3;
    this.fallSpeed = 0.2;
    this.maxFallSpeed = 10.0;
    this.box = 20;
    this.health = this.maxHealth = 20;
    this.damage = 2;
    this.right = true;
    this.facingRight = true;
    this.setPosition(x, y);

    this.sprite = scene.add.sprite(x, y, "slugger").setDepth(4);
    this.sprite.play("slugger_walk");
  }

  private getNextPosition() {
    if (this.left) {
      this.dx -= this.moveSpeed;
      if (this.dx < -this.maxSpeed) this.dx = -this.maxSpeed;
    } else if (this.right) {
      this.dx += this.moveSpeed;
      if (this.dx > this.maxSpeed) this.dx = this.maxSpeed;
    }
    if (this.falling) this.dy += this.fallSpeed;
  }

  step(time: number) {
    this.getNextPosition();
    this.checkTileMapCollision();
    // 벽에 막히면 방향 전환
    if (this.right && this.dx === 0) {
      this.right = false;
      this.left = true;
      this.facingRight = false;
    } else if (this.left && this.dx === 0) {
      this.right = true;
      this.left = false;
      this.facingRight = true;
    }
    super.step(time);
    this.syncSprite();
  }
}
