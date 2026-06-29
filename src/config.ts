// 게임 전역 상수. 원작(_main.GamePanel)의 논리 해상도를 그대로 사용합니다.
export const GAME = {
  WIDTH: 320,
  HEIGHT: 240,
  TILE_SIZE: 30,
  // 물리 고정 스텝(ms). 원작의 Thread.sleep(10)과 동일한 100Hz 틱.
  PHYSICS_STEP_MS: 10,
  // 한국어를 지원하는 폰트 스택
  FONT: '"Noto Sans KR", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif',
};

// 색상 팔레트
export const COLORS = {
  title: "#800000",
  text: "#ffffff",
  selected: "#000000",
  unselected: "#d40000",
};
