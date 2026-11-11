export const state = {
    file: null,
    blob: null,
    pdfBase64: null,
    imageWidth: 0,
    imageHeight: 0,
    totalRot: 0,
    mode: "auto",   // "auto" | "manual"
    crop: null,
    crop_coords: { x:0, y:0, w:0, h:0 },
    pdfDoc: null,
    images: [],
}