import Phaser from "phaser";
import { GAME } from "../config";

// 원작 tile.TileMap / Tile 을 포팅.
// .map 파일 형식: 1줄=가로 타일 수, 2줄=세로 타일 수, 이후 행마다 타일 인덱스.
// 타일 인덱스 v -> 타일셋의 col = v % cols, row = v < cols ? 0 : 1
// v >= cols 이면 BLOCKED(충돌), 그 외 NORMAL(장식).
export class TileMap {
  readonly tileSize = GAME.TILE_SIZE;
  readonly widthCount: number;
  readonly heightCount: number;
  readonly worldWidth: number;
  readonly worldHeight: number;
  private grid: number[][];
  private cols: number;

  constructor(scene: Phaser.Scene, tilesetKey: string, mapText: string) {
    const lines = mapText.split(/\r?\n/);
    this.widthCount = parseInt(lines[0], 10);
    this.heightCount = parseInt(lines[1], 10);
    this.grid = [];
    for (let h = 0; h < this.heightCount; h++) {
      const tokens = lines[2 + h].trim().split(/\s+/);
      const row: number[] = [];
      for (let w = 0; w < this.widthCount; w++) row.push(parseInt(tokens[w], 10));
      this.grid.push(row);
    }
    this.worldWidth = this.widthCount * this.tileSize;
    this.worldHeight = this.heightCount * this.tileSize;

    const tex = scene.textures.get(tilesetKey);
    this.cols = Math.floor(tex.getSourceImage().width / this.tileSize);

    // 모든 타일을 RenderTexture 한 장에 그려 정적 배경 레이어로 사용(성능 최적).
    const rt = scene.add.renderTexture(0, 0, this.worldWidth, this.worldHeight);
    rt.setOrigin(0, 0);
    rt.setDepth(0);
    for (let h = 0; h < this.heightCount; h++) {
      for (let w = 0; w < this.widthCount; w++) {
        const v = this.grid[h][w];
        if (v === 0) continue; // 0 = 빈 하늘
        rt.drawFrame(tilesetKey, String(v), w * this.tileSize, h * this.tileSize);
      }
    }
  }

  // 원작 getType(y, x): 범위를 벗어나면 NORMAL(0) 처리해 안전하게.
  getType(row: number, col: number): number {
    if (row < 0 || row >= this.heightCount || col < 0 || col >= this.widthCount) {
      return 0; // NORMAL
    }
    return this.grid[row][col] >= this.cols ? 1 : 0; // 1 = BLOCKED
  }
}

export const BLOCKED = 1;
