import { state } from "./state.js"
import {
    addAlphaChannelToUnit8ClampedArray,
} from "./utils.js";

export async function loadPdf(file) {
    if (file.type !== "application/pdf") {
        alert(`File ${file.name} is not a PDF file type`);
        return null;
    }
    state.file = file;

    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(new Uint8Array(buffer)).promise;

    const pages = await Promise.all(
        Array.from({ length: pdf.numPages }, (_, i) => getPageImages(i + 1, pdf)),
    );
    return { pdf, images: pages.flat() };
}

const getObj = (page, name) =>
    new Promise((resolve) => page.objs.get(name, resolve));

async function getPageImages(pageNum, pdf) {
    const page = await pdf.getPage(pageNum);
    const ops = await page.getOperatorList();

    const valid = [
        pdfjsLib.OPS.paintImageXObject,
        pdfjsLib.OPS.paintImageXObjectRepeat,
        pdfjsLib.OPS.paintJpegXObject,
    ];

    const names = [];
    ops.fnArray.forEach((fn, idx) => {
        if (valid.includes(fn)) names.push(ops.argsArray[idx][0]);
    });

    return Promise.all(
        names.map(async (name) => {
            const image = await getObj(page, name);
            return {
                rgba: addAlphaChannelToUnit8ClampedArray(image.data, image.width, image.height),
                width: image.width,
                height: image.height,
            };
        }),
    );
}

export function decodeQr({ rgba, width, height }){
    const result = jsQR(rgba, width, height);
    return result ? result.data : null;
}