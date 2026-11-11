import { PDFDocument, degrees } from "https://cdn.skypack.dev/pdf-lib@^1.11.1";
import {
    base64ToArrayBuffer,
} from "./utils.js";

const A4_SHORT = 595.28;
const A4_LONG = 841.89;

export async function buildRotatedPdf(pngBase64, width, height, deg) {
    const pdfDoc = await PDFDocument.create();
    const png = await pdfDoc.embedPng(base64ToArrayBuffer(pngBase64));

    const scale = Math.min(
        1,
        A4_SHORT / Math.min(width, height),
        A4_LONG / Math.max(width, height),
    );
    const w = width * scale;
    const h = height * scale;

    const page = pdfDoc.addPage([w, h]);
    page.drawImage(png, { x: 0, y: 0, width: w, height: h });
    page.setRotation(degrees(Number(deg)));

    const bytes = await pdfDoc.save();
    return new Blob([bytes], { type: "application/pdf" });
}

export async function buildManualPdf(file, { deg, crop }) {
    const pdfDoc = await PDFDocument.load(await file.arrayBuffer());

    for (let i = pdfDoc.getPageCount() - 1; i > 0; i--) pdfDoc.removePage(i);
    const page = pdfDoc.getPage(0);

    if (crop) {
        const b = page.getCropBox();
        page.setCropBox(
            b.x + crop.x * b.width,
            b.y + b.height - (crop.y + crop.h) * b.height,
            crop.w * b.width,
            crop.h * b.height,
        );
    }

    page.setRotation(degrees((page.getRotation().angle + Number(deg)) % 360));

    return new Blob([await pdfDoc.save()], { type: "application/pdf" });
}