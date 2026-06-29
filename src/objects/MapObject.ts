import Phaser from "phaser";
import { TileMap, BLOCKED } from "../map/TileMap";

// 원작 mapObject.MapObject 포팅: 코너 기반 타일 충돌과 이동 물리를 그대로 구현.
export class MapObject {
  scene: Phaser.Scene;
  tileMap: TileMap;
  tileSize: number;

  // 위치/속도
  x = 0;
  y = 0;
  dx = 0;
  dy = 0;
  box = 0;

  // 이동 상태
  left = false;
  right = false;
  up = false;
  down = false;
  falling = false;
  jumping = false;

  // 이동 속도 파라미터
  moveSpeed = 0;
  maxSpeed = 0;
  stopSpeed = 0;
  fallSpeed = 0;
  maxFallSpeed = 0;
  jumpStart = 0;
  stopJumpSpeed = 0;

  // 충돌 계산용
  protected nextx = 0;
  protected nexty = 0;
  protected currWidth = 0;
  protected currHeight = 0;
  protected topLeft = false;
  protected topRight = false;
  protected bottomLeft = false;
  protected bottomRight = false;

  // 렌더링
  imageWidth = 30;
  imageHeight = 30;
  facingRight = true;
  sprite!: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, tileMap: TileMap) {
    this.scene = scene;
    this.tileMap = tileMap;
    this.tileSize = tileMap.tileSize;
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  protected half(): number {
    return Math.trunc(this.box / 2);
  }

  calculateCorners(x: number, y: number) {
    const ts = this.tileSize;
    const h = this.half();
    const leftTile = Math.trunc(Math.trunc(x - h) / ts);
    const rightTile = Math.trunc(Math.trunc(x + h - 1) / ts);
    const topTile = Math.trunc(Math.trunc(y - h) / ts);
    const bottomTile = Math.trunc(Math.trunc(y + h - 1) / ts);

    this.topLeft = this.tileMap.getType(topTile, leftTile) === BLOCKED;
    this.topRight = this.tileMap.getType(topTile, rightTile) === BLOCKED;
    this.bottomLeft = this.tileMap.getType(bottomTile, leftTile) === BLOCKED;
    this.bottomRight = this.tileMap.getType(bottomTile, rightTile) === BLOCKED;
  }

  checkTileMapCollision() {
    const ts = this.tileSize;
    const h = this.half();
    this.nextx = this.x + this.dx;
    this.nexty = this.y + this.dy;

    this.currWidth = Math.trunc(Math.trunc(this.x) / ts);
    this.currHeight = Math.trunc(Math.trunc(this.y) / ts);

    this.calculateCorners(this.x, this.nexty);
    if (this.dy < 0) {
      if (this.topLeft || this.topRight) {
        this.dy = 0;
        this.y = this.currHeight * ts + h;
      } else {
        this.y += this.dy;
      }
    }
    if (this.dy > 0) {
      if (this.bottomLeft || this.bottomRight) {
        this.dy = 0;
        this.falling = false;
        this.y = (this.currHeight + 1) * ts - h;
      } else {
        this.y += this.dy;
      }
    }

    this.calculateCorners(this.nextx, this.y);
    if (this.dx < 0) {
      if (this.topLeft || this.bottomLeft) {
        this.dx = 0;
        this.x = this.currWidth * ts + h;
      } else {
        this.x += this.dx;
      }
    }
    if (this.dx > 0) {
      if (this.topRight || this.bottomRight) {
        this.dx = 0;
        this.x = (this.currWidth + 1) * ts - h;
      } else {
        this.x += this.dx;
      }
    }

    if (!this.falling) {
      this.calculateCorners(this.x, this.nexty + 1);
      if (!this.bottomLeft && !this.bottomRight) {
        this.falling = true;
      }
    }
  }

  getRect(): Phaser.Geom.Rectangle {
    const h = this.half();
    return new Phaser.Geom.Rectangle(this.x - h, this.y - h, this.box, this.box);
  }

  intersects(o: MapObject): boolean {
    return Phaser.Geom.Rectangle.Overlaps(this.getRect(), o.getRect());
  }

  // sprite 위치/방향을 논리 좌표에 동기화
  syncSprite() {
    if (!this.sprite) return;
    this.sprite.setPosition(this.x, this.y);
    this.sprite.setFlipX(!this.facingRight);
  }

  destroy() {
    this.sprite?.destroy();
  }
}
