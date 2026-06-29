import Phaser from "phaser";
import { MapObject } from "./MapObject";
import { TileMap } from "../map/TileMap";

// 원작 mapObject.FireBall 포팅.
export class FireBall extends MapObject {
  private hit = false;
  private removeFlag = false;
  private hitDone = false;

  constructor(scene: Phaser.Scene, tileMap: TileMap, right: boolean, x: number, y: number) {
    super(scene, tileMap);
    this.facingRight = right;
    this.moveSpeed = 3.8;
    this.dx = right ? this.moveSpeed : -this.moveSpeed;
    this.imageWidth = 30;
    this.imageHeight = 30;
    this.box = 14;
    this.setPosition(x, y);

    this.sprite = scene.add.sprite(x, y, "fireball").setDepth(6);
    this.sprite.play("fireball_move");
    this.sprite.on("animationcomplete", (anim: Phaser.Animations.Animation) => {
      if (anim.key === "fireball_hit") this.hitDone = true;
    });
  }

  setHit() {
    if (this.hit) return;
    this.hit = true;
    this.dx = 0;
    this.sprite.play("fireball_hit");
  }

  isRemove(): boolean {
    return this.removeFlag;
  }

  step() {
    this.checkTileMapCollision();
    if (this.dx === 0 && !this.hit) this.setHit();
    if (this.hit && this.hitDone) this.removeFlag = true;
    this.syncSprite();
  }
}
