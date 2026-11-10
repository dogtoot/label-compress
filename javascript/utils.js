export function base64ToArrayBuffer(base64) {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

export function addAlphaChannelToUnit8ClampedArray(
    unit8Array,
    imageWidth,
    imageHeight,
) {
    const newImageData = new Uint8ClampedArray(imageWidth * imageHeight * 4);

    for (let j = 0, k = 0, jj = imageHeight * imageWidth * 4; j < jj; ) {
        newImageData[j++] = unit8Array[k++];
        newImageData[j++] = unit8Array[k++];
        newImageData[j++] = unit8Array[k++];
        newImageData[j++] = 255;
    }

    return newImageData;
}

export function getBrowser() {
    if (navigator.userAgentData) {
        const brands = navigator.userAgentData.brands;
        const isChromium = brands.some(
            (item) =>
                item.brand === "Chromium" || item.brand === "Google Chrome",
        );
        if (isChromium) return "Chromium";
    }

    const ua = navigator.userAgent.toLowerCase();

    if (ua.includes("firefox") || ua.includes("fxios")) {
        return "Firefox";
    }

    if (
        ua.includes("chrome") ||
        ua.includes("chromium") ||
        ua.includes("crios")
    ) {
        return "Chromium";
    }

    return "Other";
}