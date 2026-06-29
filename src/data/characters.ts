// 캐릭터 정의 - 데이터 기반이라 새 캐릭터/육성 스탯을 쉽게 추가할 수 있습니다.
export interface CharacterStats {
  id: string;
  name: string;
  maxHealth: number;
  moveSpeed: number;
  maxSpeed: number;
  jumpStart: number;     // 점프 초기 속도(음수 = 위로)
  scratchDamage: number;
  scratchRange: number;
  fireBallDamage: number;
  spriteKey: string;     // 로드된 스프라이트시트 키
}

export const CHARACTERS: Record<string, CharacterStats> = {
  ryan: {
    id: "ryan",
    name: "라이몽",
    maxHealth: 5,
    moveSpeed: 0.3,
    maxSpeed: 1.6,
    jumpStart: -4.8,
    scratchDamage: 8,
    scratchRange: 40,
    fireBallDamage: 5,
    spriteKey: "player",
  },
  // 예시) 미래에 추가할 캐릭터. 스탯만 바꿔 넣으면 됩니다.
  // ryanPlus: { ...CHARACTERS.ryan, id: "ryanPlus", name: "강화 라이몽", maxHealth: 7, maxSpeed: 2.0 },
};
