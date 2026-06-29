// 모바일용 화면 터치 컨트롤 오버레이.
// 터치 가능한 기기(또는 ?touch=1)에서만 표시되며, 입력을 virtualInput으로 전달한다.
import { setHeld, press } from "./virtualInput";

function isTouchDevice(): boolean {
  const params = new URLSearchParams(location.search);
  if (params.get("touch") === "1") return true;
  if (params.get("touch") === "0") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

function injectStyle() {
  const css = `
  #touch-controls {
    position: fixed; inset: 0; z-index: 10;
    pointer-events: none;
    font-family: ${'"Noto Sans KR", sans-serif'};
    user-select: none; -webkit-user-select: none;
    touch-action: none;
  }
  #touch-controls .pad, #touch-controls .actions {
    position: absolute; bottom: 18px; pointer-events: none;
  }
  #touch-controls .pad { left: 16px; }
  #touch-controls .actions { right: 16px; }
  #touch-controls button {
    pointer-events: auto; position: absolute;
    width: 60px; height: 60px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.55);
    background: rgba(20,20,30,0.4); color: #fff;
    font-size: 13px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    touch-action: none; -webkit-tap-highlight-color: transparent;
  }
  #touch-controls button:active, #touch-controls button.on {
    background: rgba(255,255,255,0.45); color: #111;
  }
  /* 방향패드 (십자) */
  #btn-left  { left: 0;   bottom: 60px; }
  #btn-right { left: 120px; bottom: 60px; }
  #btn-up    { left: 60px; bottom: 120px; }
  #btn-down  { left: 60px; bottom: 0; }
  /* 액션 버튼 */
  #btn-jump  { right: 0;    bottom: 60px; width: 68px; height: 68px; background: rgba(40,120,220,0.5); }
  #btn-glide { right: 76px; bottom: 110px; }
  #btn-scr   { right: 76px; bottom: 6px; }
  #btn-fire  { right: 0;    bottom: 140px; background: rgba(220,80,40,0.5); }
  #touch-controls .hint {
    position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%);
    color: rgba(255,255,255,0.5); font-size: 11px; pointer-events: none;
  }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
}

// 유지형 버튼: 누르는 동안 held=true
function bindHeld(btn: HTMLElement, name: "left" | "right" | "glide") {
  const on = (e: Event) => { e.preventDefault(); setHeld(name, true); btn.classList.add("on"); };
  const off = (e: Event) => { e.preventDefault(); setHeld(name, false); btn.classList.remove("on"); };
  btn.addEventListener("pointerdown", on);
  btn.addEventListener("pointerup", off);
  btn.addEventListener("pointerleave", off);
  btn.addEventListener("pointercancel", off);
}

// 원샷 버튼: 누를 때마다 press
function bindPress(btn: HTMLElement, names: ("jump" | "scratch" | "fire" | "up" | "down" | "enter")[]) {
  const on = (e: Event) => {
    e.preventDefault();
    names.forEach((n) => press(n));
    btn.classList.add("on");
  };
  const off = (e: Event) => { e.preventDefault(); btn.classList.remove("on"); };
  btn.addEventListener("pointerdown", on);
  btn.addEventListener("pointerup", off);
  btn.addEventListener("pointerleave", off);
  btn.addEventListener("pointercancel", off);
}

export function setupTouchControls() {
  if (!isTouchDevice()) return;

  injectStyle();
  const root = document.createElement("div");
  root.id = "touch-controls";
  root.innerHTML = `
    <div class="pad">
      <button id="btn-up" aria-label="up">▲</button>
      <button id="btn-left" aria-label="left">◀</button>
      <button id="btn-right" aria-label="right">▶</button>
      <button id="btn-down" aria-label="down">▼</button>
    </div>
    <div class="actions">
      <button id="btn-fire">불</button>
      <button id="btn-glide">활공</button>
      <button id="btn-jump">점프</button>
      <button id="btn-scr">할퀴</button>
    </div>
  `;
  document.body.appendChild(root);

  bindHeld(document.getElementById("btn-left")!, "left");
  bindHeld(document.getElementById("btn-right")!, "right");
  bindHeld(document.getElementById("btn-glide")!, "glide");
  // 점프 버튼은 메뉴에서 "선택(Enter)" 역할도 겸한다.
  bindPress(document.getElementById("btn-jump")!, ["jump", "enter"]);
  bindPress(document.getElementById("btn-scr")!, ["scratch"]);
  bindPress(document.getElementById("btn-fire")!, ["fire"]);
  // 방향 위/아래는 메뉴 이동용(게임 중에는 사용 안 함).
  bindPress(document.getElementById("btn-up")!, ["up"]);
  bindPress(document.getElementById("btn-down")!, ["down"]);

  // 페이지 스크롤/줌 방지
  document.body.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

}
