// 키보드와 터치 입력을 통합하는 공유 가상 입력 모듈.
// - 유지형(held): 누르고 있는 동안 true (left/right/glide)
// - 원샷(one-shot): 한 번 눌림을 큐에 쌓고 consume()로 1회 소비 (jump/scratch/fire/up/down/enter)

type Held = "left" | "right" | "glide";
type OneShot = "jump" | "scratch" | "fire" | "up" | "down" | "enter";

const held: Record<Held, boolean> = { left: false, right: false, glide: false };
const oneShot: Record<OneShot, boolean> = {
  jump: false, scratch: false, fire: false, up: false, down: false, enter: false,
};

export const vinput = {
  get left() { return held.left; },
  get right() { return held.right; },
  get glide() { return held.glide; },
};

export function setHeld(name: Held, value: boolean) {
  held[name] = value;
}

export function press(name: OneShot) {
  oneShot[name] = true;
}

// 원샷 입력 1회 소비. 큐에 있으면 true 반환 후 초기화.
export function consume(name: OneShot): boolean {
  if (oneShot[name]) {
    oneShot[name] = false;
    return true;
  }
  return false;
}

// 씬 전환 시 입력 누수 방지용 초기화.
export function resetAll() {
  held.left = held.right = held.glide = false;
  (Object.keys(oneShot) as OneShot[]).forEach((k) => (oneShot[k] = false));
}
