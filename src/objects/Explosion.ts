import Phaser from "phaser";
import { TileMap } from "../map/TileMap";

// 적 사망 시 폭발 이펙트. 애니메이션이 끝나면 제거 플래그.
export class Explosion {
  private sprite: Phaser.GameObjects.Sprite;
  private removeFlag = false;

  constructor(scene: Phaser.Scene, _tileMap: TileMap, x: number, y: number) {
    this.sprite = scene.add.sprite(x, y, "explosion").setDepth(5);
    this.sprite.play("explosion");
    this.sprite.on("animationcomplete", () => {
      this.removeFlag = true;
    });
  }

  isRemove(): boolean {
    return this.removeFlag;
  }

  destroy() {
    this.sprite.destroy();
  }
}
