import { state } from "./state.js";
import { els } from "./dom.js";

const overlay = els.cropOverlay;
const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const FULL = { x: 0, y: 0, w: 1, h: 1 };
const HIT_PX = 14;   
const HANDLE_PX = 10;
const MIN = 0.02;    

let drag = null;     

export const redrawCrop = () => { if (!overlay.hidden) draw(); };

export function setCropEnabled(on) {
    overlay.hidden = !on;
    if (!on) return;
    overlay.width = els.canvas.width;
    overlay.height = els.canvas.height;
    if (!state.crop) state.crop = { ...FULL };
    draw();
}

export function resetCrop() {
    state.crop = { ...FULL };
    draw();
}

function toFraction(ev) {
    const r = overlay.getBoundingClientRect();
    const dx = ev.clientX - (r.left + r.width / 2);
    const dy = ev.clientY - (r.top + r.height / 2);
    const t = (state.totalRot * Math.PI) / 180;
    const ux = dx * Math.cos(t) + dy * Math.sin(t);
    const uy = -dx * Math.sin(t) + dy * Math.cos(t);
    return {
        x: clamp(ux / overlay.offsetWidth + 0.5),
        y: clamp(uy / overlay.offsetHeight + 0.5),
    };
}

const corners = (c) => [
    { x: c.x, y: c.y },            
    { x: c.x + c.w, y: c.y },      
    { x: c.x + c.w, y: c.y + c.h },
    { x: c.x, y: c.y + c.h },      
];

function hitCorner(p) {
    const W = overlay.offsetWidth, H = overlay.offsetHeight;
    return corners(state.crop).findIndex(
        (k) => Math.hypot((p.x - k.x) * W, (p.y - k.y) * H) <= HIT_PX,
    );
}

const inside = (p, c) =>
    p.x >= c.x && p.x <= c.x + c.w && p.y >= c.y && p.y <= c.y + c.h;

function boxFrom(a, b) {
    return {
        x: Math.min(a.x, b.x), y: Math.min(a.y, b.y),
        w: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y),
    };
}

function draw() {
    const ctx = overlay.getContext("2d");
    const W = overlay.width, H = overlay.height;
    ctx.clearRect(0, 0, W, H);
    const c = state.crop;
    if (!c) return;

    const k = overlay.offsetWidth ? W / overlay.offsetWidth : 1;

    ctx.fillStyle = "rgba(0,0,0,.45)";
    ctx.fillRect(0, 0, W, H);
    ctx.clearRect(c.x * W, c.y * H, c.w * W, c.h * H);

    ctx.strokeStyle = "#5500a0";
    ctx.lineWidth = 2 * k;
    ctx.strokeRect(c.x * W, c.y * H, c.w * W, c.h * H);

    const s = HANDLE_PX * k;
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1 * k;
    for (const p of corners(c)) {
        const cx = clamp(p.x * W, s / 2, W - s / 2);
        const cy = clamp(p.y * H, s / 2, H - s / 2);
        ctx.fillRect(cx - s / 2, cy - s / 2, s, s);
        ctx.strokeRect(cx - s / 2, cy - s / 2, s, s);
    }
}

export function initCrop(onChange) {
    console.log("initCrop ran");
    overlay.addEventListener("pointerdown", (ev) => {
        console.log("crop pointerdown", state.crop);
        overlay.setPointerCapture(ev.pointerId);
        const p = toFraction(ev);
        const before = { ...state.crop };
        const i = hitCorner(p);

        if (i >= 0) {
            drag = { type: "corner", fixed: corners(state.crop)[(i + 2) % 4], before };
        } else if (inside(p, state.crop)) {
            drag = { type: "move", start: p, box: before, before };
        } else {
            drag = { type: "corner", fixed: p, before };
            state.crop = { x: p.x, y: p.y, w: 0, h: 0 };
        }
    });

    overlay.addEventListener("pointermove", (ev) => {
        const p = toFraction(ev);

        if (!drag) {
            // hover feedback
            overlay.style.cursor =
                hitCorner(p) >= 0 ? "pointer" : inside(p, state.crop) ? "move" : "crosshair";
            return;
        }

        if (drag.type === "corner") {
            state.crop = boxFrom(drag.fixed, p);
        } else {
            const b = drag.box;
            state.crop = {
                ...b,
                x: clamp(b.x + (p.x - drag.start.x), 0, 1 - b.w),
                y: clamp(b.y + (p.y - drag.start.y), 0, 1 - b.h),
            };
        }
        draw();
    });

    const finish = () => {
        if (!drag) return;
        const c = state.crop;
        if (c.w < MIN || c.h < MIN) state.crop = drag.before;
        drag = null;
        draw();
        onChange();
    };
    overlay.addEventListener("pointerup", finish);
    overlay.addEventListener("pointercancel", finish);
}