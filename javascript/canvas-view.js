import { els } from "./dom.js";
import { state } from "./state.js";

export function applyCanvasSize(rot) {
    const rotated = rot == 90 || rot == 270;
    const w = window.innerWidth;
    const scale = rotated ? (w >= 800 ? 0.5 : 0.25) : w >= 800 ? 0.6 : 0.25;
    els.canvas.style.width = state.imageWidth * scale + "px";
    els.canvas.style.height = state.imageHeight * scale + "px";
    els.canvasBox.style.width =
        (rotated ? els.canvas.clientHeight : els.canvas.clientWidth) + "px";
    els.canvasBox.style.height =
        (rotated ? els.canvas.clientWidth : els.canvas.clientHeight) + "px";
}

export function drawToCanvas({ rgba, width, height }) {
    els.canvas.hidden = false;
    els.canvas.width = width;
    els.canvas.height = height;
    state.imageWidth = width;
    state.imageHeight = height;
    els.canvas.getContext("2d").putImageData(new ImageData(rgba, width, height), 0, 0);
    return els.canvas.toDataURL();
}

window.addEventListener("resize", (event) => {
    applyCanvasSize(state.totalRot);
});

export function rotateCanvas(rotcanvas) {
    state.totalRot = rotcanvas;
    if (state.file != undefined) {
        applyCanvasSize(state.totalRot);

        els.canvas.style.transform = "rotate(" + rotcanvas + "deg)";
        els.canvas.style.transformOrigin = "50% 50%";
    }
}