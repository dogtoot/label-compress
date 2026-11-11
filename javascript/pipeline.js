import { state } from "./state.js";
import { loadPdf, decodeQr } from "./pdf-read.js";
import { buildRotatedPdf, buildManualPdf } from "./pdf-write.js";
import { drawToCanvas, renderPdfPage, rotateCanvas, applyCanvasSize } from "./canvas-view.js";
import { setCropEnabled } from "./crop.js";
import { showFileName, showQrResult, showDownloadLinks } from "./output.js";

export async function handleFile(file) {
    const result = await loadPdf(file);
    if (!result) return;
    state.pdfDoc = result.pdf;
    state.images = result.images;
    showFileName(file.name);
    await refresh();
}

export async function refresh() {
    if (!state.file) return;
    if (state.mode === "manual") await prepareManual();
    else prepareAuto();
    await regeneratePdf();
    applyCanvasSize(state.totalRot);
}

function prepareAuto() {
    setCropEnabled(false);
    const img = state.images[0];
    if (!img) return;
    state.imageWidth = img.width;
    state.imageHeight = img.height;
    state.pdfBase64 = drawToCanvas(img).replace("data:image/png;base64,", "");
    const qr = decodeQr(img);
    if (qr) showQrResult(qr);
}

async function prepareManual() {
    await renderPdfPage(state.pdfDoc); 
    setCropEnabled(true);
}

export async function regeneratePdf() {
    if (!state.file) return;
    if (state.mode === "manual") {
        state.blob = await buildManualPdf(state.file, {
            deg: state.totalRot,
            crop: state.crop,
        });
    } else {
        if (!state.pdfBase64) return;
        state.blob = await buildRotatedPdf(
            state.pdfBase64, state.imageWidth, state.imageHeight, state.totalRot,
        );
    }
    showDownloadLinks(state.blob, "Output_" + state.file.name);
    rotateCanvas(state.totalRot);
}