let printFrame = null;
let printUrl = null;

async function printPdf(url) {
    const response = await fetch(url);
    const blob = await response.blob();

    if (printFrame) printFrame.remove();
    if (printUrl) URL.revokeObjectURL(printUrl);

    printUrl = URL.createObjectURL(blob);

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = printUrl;

    iframe.onload = () => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    };

    document.body.appendChild(iframe);
    printFrame = iframe;
}