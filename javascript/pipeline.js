import { state } from "./state.js";
import { loadPdf, decodeQr } from "./pdf-read.js";
import { buildRotatedPdf } from "./pdf-write.js";
import { drawToCanvas, rotateCanvas } from "./canvas-view.js";
import { showFileName, showQrResult, showDownloadLinks } from "./output.js";

export async function handleFile(file) {
    const images = await loadPdf(file);
    if (!images?.length) return;

    showFileName(file.name);

    const img = images[0];
    const dataUrl = drawToCanvas(img);
    state.pdfBase64 = dataUrl.replace("data:image/png;base64,", "");

    const qr = decodeQr(img);
    if (qr) showQrResult(qr);

    await regeneratePdf();
}

export async function regeneratePdf() {
    if (!state.pdfBase64 || !state.file) return;
    state.blob = await buildRotatedPdf(
        state.pdfBase64, state.imageWidth, state.imageHeight, state.totalRot,
    );
    showDownloadLinks(state.blob, "Output_" + state.file.name);
    rotateCanvas(state.totalRot);
}