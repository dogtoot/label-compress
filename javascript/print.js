function printPdf(url) {
    fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
            const blobUrl = URL.createObjectURL(blob);

            const iframe = document.createElement("iframe");
            iframe.style.display = "none";
            iframe.src = blobUrl;

            iframe.onload = () => {
                iframe.focus();
                iframe.contentWindow.print();

                // Cleanup after a short delay
                setTimeout(() => {
                    URL.revokeObjectURL(blobUrl);
                    iframe.remove();
                }, 1000);
            };

            document.body.appendChild(iframe);
        })
        .catch((err) => {
            console.error("Failed to print PDF:", err);
        });
}
