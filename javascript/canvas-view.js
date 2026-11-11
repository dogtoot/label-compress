import { els } from "./dom.js";
import { state } from "./state.js";
import { redrawCrop } from "./crop.js";

export function applyCanvasSize(rot) {
    const rotated = rot == 90 || rot == 270;
    const w = window.innerWidth;
    const scale = rotated ? (w >= 800 ? 0.5 : 0.25) : w >= 800 ? 0.6 : 0.25;
    els.canvas.style.width = els.canvas.width * scale + "px";
    els.canvas.style.height = els.canvas.height * scale + "px";
    els.canvasBox.style.width =
        (rotated ? els.canvas.clientHeight : els.canvas.clientWidth) + "px";
    els.canvasBox.style.height =
        (rotated ? els.canvas.clientWidth : els.canvas.clientHeight) + "px";

    syncOverlay();
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
    if (state.file) {
        applyCanvasSize(state.totalRot);

        els.canvas.style.transform = "rotate(" + rotcanvas + "deg)";
        els.canvas.style.transformOrigin = "50% 50%";
        syncOverlay();
    }
}

export async function renderPdfPage(pdf, pageNum = 1, targetWidth = 1200) {
    const page = await pdf.getPage(pageNum);
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: targetWidth / base.width });

    els.canvas.hidden = false;
    els.canvas.width = viewport.width;
    els.canvas.height = viewport.height;

    await page.render({
        canvasContext: els.canvas.getContext("2d"),
        viewport,
    }).promise;
}

export function syncOverlay() {
    const o = els.cropOverlay, c = els.canvas;

    o.style.left = c.offsetLeft + c.clientLeft + "px";
    o.style.top = c.offsetTop + c.clientTop + "px";
    o.style.width = c.clientWidth + "px";
    o.style.height = c.clientHeight + "px";

    o.style.transform = c.style.transform;
    o.style.transformOrigin = c.style.transformOrigin;

    redrawCrop();
}