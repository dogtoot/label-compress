export function showFileName(name) {
    document.getElementById("file-name").textContent = name;
}

export function showQrResult(text) {
    document.getElementById("output").innerHTML += `${JSON.stringify(text, null, 2)}\n`;
}

export function showDownloadLinks(blob, filename) {
    const link = document.getElementById("downloadLink");
    URL.revokeObjectURL(link.href);
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = "block";
    document.getElementById("printLink").style.display = "block";
}