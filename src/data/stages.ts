// 스테이지 정의 - 맵/적/시작위치/다음스테이지를 데이터로 관리합니다.
// 새 스테이지를 추가하려면 맵 파일(public/assets/maps)을 만들고 여기에 항목만 추가하세요.
export interface EnemySpawn {
  type: "slugger";
  x: number;
  y: number;
}

export interface StageDef {
  key: string;          // 표시 이름 (예: "1-1")
  mapKey: string;       // 로드된 맵 데이터 키
  bg: string;           // 배경 이미지 키
  playerStart: { x: number; y: number };
  enemies: EnemySpawn[];
}

export const STAGES: StageDef[] = [
  {
    key: "1-1",
    mapKey: "map_1-1",
    bg: "grassbg1",
    playerStart: { x: 100, y: 100 },
    enemies: [
      { type: "slugger", x: 200, y: 100 },
      { type: "slugger", x: 860, y: 200 },
      { type: "slugger", x: 1525, y: 200 },
      { type: "slugger", x: 1680, y: 200 },
      { type: "slugger", x: 1800, y: 200 },
    ],
  },
  {
    key: "1-2",
    mapKey: "map_1-2",
    bg: "grassbg1",
    playerStart: { x: 80, y: 100 },
    enemies: [
      { type: "slugger", x: 360, y: 100 },
      { type: "slugger", x: 850, y: 150 },
      { type: "slugger", x: 1600, y: 150 },
      { type: "slugger", x: 2300, y: 100 },
      { type: "slugger", x: 2600, y: 100 },
    ],
  },
  {
    key: "1-3",
    mapKey: "map_1-3",
    bg: "grassbg1",
    playerStart: { x: 80, y: 100 },
    enemies: [
      { type: "slugger", x: 800, y: 150 },
      { type: "slugger", x: 1500, y: 100 },
      { type: "slugger", x: 2250, y: 150 },
      { type: "slugger", x: 2900, y: 150 },
    ],
  },
];
