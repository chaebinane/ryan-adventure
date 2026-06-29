# 라이몽의 모험 (Ryan's Adventure)

자바로 만들던 2D 플랫포머를 **Phaser 3 + TypeScript + Vite** 스택으로 새로 설계한 버전입니다.
캐릭터·맵·적·공격 등 원작 디자인과 에셋을 그대로 유지하면서, 메뉴/도움말/HUD/여러 스테이지/스테이지 클리어·게임오버 화면까지 추가해 "완성된 게임"으로 만들었습니다.

## 조작법

| 키 | 동작 |
|----|------|
| ← → | 이동 |
| W | 점프 |
| E | 활공 (하강 중에 누르면 천천히 떨어짐) |
| R | 할퀴기 공격 |
| F | 파이어볼 |
| ↑ ↓ / Enter | 메뉴 이동 / 선택 |

적(슬러거)을 물리치고 맵 오른쪽 끝의 **GOAL 깃발**에 도달하면 다음 스테이지로 넘어갑니다. 총 3개 스테이지, 목숨 3개, 점수 시스템이 있습니다.

---

## 1. 로컬에서 실행하기

Node.js 18 이상이 필요합니다. (https://nodejs.org 에서 설치)

```bash
cd ryan-adventure
npm install      # 최초 1회 - 라이브러리 설치
npm run dev      # 개발 서버 실행
```

터미널에 표시되는 주소(보통 http://localhost:5173)를 브라우저에서 열면 바로 플레이할 수 있습니다.

> 이미 빌드된 결과물(`dist/` 폴더)이 들어 있어, 설치 없이 배포만 하고 싶다면 아래 2번으로 바로 가도 됩니다.

---

## 2. 온라인 주소로 배포하기

브라우저 게임이므로 정적 호스팅에 `dist/` 폴더만 올리면 누구나 URL로 접속해 플레이할 수 있습니다.
(직접 빌드하려면 `npm run build` → `dist/` 가 새로 생성됩니다.)

### 방법 A. Netlify Drop — 가장 빠름 (계정만 있으면 1분)

1. https://app.netlify.com/drop 접속 (무료 가입/로그인)
2. 이 프로젝트의 **`dist` 폴더를 통째로 드래그 앤 드롭**
3. 끝! `https://랜덤이름.netlify.app` 형태의 주소가 즉시 생성됩니다. (사이트 설정에서 이름 변경 가능)

### 방법 B. GitHub Pages — 무료 영구 주소

1. GitHub에 새 저장소를 만들고 이 프로젝트를 푸시합니다.
   ```bash
   git init
   git add .
   git commit -m "라이몽의 모험"
   git branch -M main
   git remote add origin https://github.com/<사용자명>/<저장소명>.git
   git push -u origin main
   ```
2. 저장소 **Settings → Pages → Build and deployment → Source** 를 "GitHub Actions"로 선택하거나,
   아래처럼 `dist`를 `gh-pages` 브랜치로 배포합니다. 가장 간단한 방법:
   ```bash
   npm install -g gh-pages   # 최초 1회
   npm run build
   npx gh-pages -d dist
   ```
3. Settings → Pages 에서 `gh-pages` 브랜치를 소스로 지정하면
   `https://<사용자명>.github.io/<저장소명>/` 주소로 접속됩니다.
   (`vite.config.ts`의 `base: "./"` 설정 덕분에 하위 경로에서도 정상 동작합니다.)

### 방법 C. Vercel

1. https://vercel.com 가입 후 GitHub 저장소를 import
2. Framework는 **Vite**로 자동 인식 — Build Command `npm run build`, Output `dist`
3. Deploy를 누르면 `https://프로젝트.vercel.app` 주소가 생성됩니다.

---

## 3. 프로젝트 구조 (확장하기 좋게 설계)

```
src/
├─ config.ts            전역 상수(해상도, 물리 스텝 등)
├─ main.ts              Phaser 게임 생성 + 씬 등록
├─ data/
│  ├─ stages.ts         스테이지 정의(맵/적/시작위치) — 여기만 추가하면 스테이지 증가
│  └─ characters.ts     캐릭터 스탯 정의 — 새 캐릭터/육성 스탯 추가 지점
├─ map/TileMap.ts       .map 파일 렌더링 + 타일 충돌
├─ objects/             게임 오브젝트(원작 물리 1:1 포팅)
│  ├─ MapObject.ts      이동/충돌 베이스 클래스
│  ├─ Player.ts         플레이어(점프/활공/할퀴기/파이어볼)
│  ├─ Enemy.ts / Slugger.ts
│  ├─ FireBall.ts / Explosion.ts
└─ scenes/              Boot / Menu / Help / Game / UI(HUD) / StageClear / GameOver
```

### 스테이지 추가하기
1. `public/assets/maps/` 에 새 `.map` 파일 추가 (형식: 1줄=가로 타일 수, 2줄=세로 타일 수, 이후 타일 인덱스 격자)
2. `src/scenes/BootScene.ts` 의 `preload()` 에 `this.load.text("map_1-4", "assets/maps/level1-4.map")` 추가
3. `src/data/stages.ts` 의 `STAGES` 배열에 항목 추가

### 새 캐릭터/육성 추가하기
`src/data/characters.ts` 의 `CHARACTERS` 에 스탯 객체를 추가하고, `GameScene` 에서 사용할 캐릭터 키만 바꾸면 됩니다.
스프라이트시트를 추가하면 외형까지 교체할 수 있습니다.

---

## 기술 메모
- 논리 해상도 320×240을 화면에 맞춰 확대(FIT). 픽셀아트 선명도 유지.
- 물리는 원작의 `Thread.sleep(10)`(100Hz)과 동일하게 **고정 타임스텝 누적 방식**으로 구현해 움직임 감각을 보존했습니다.
- 타일맵은 원작의 코너 기반 충돌 로직을 그대로 포팅했습니다.
