/**
         * Prints a PDF in a browser using a hidden iframe. Works in recent versions of Firefox, Chrome, Safari and Edge. Does
         * not work in IE 11 and instead attempts to open the PDF in a new tab.
         *
         * Note that the PDF URL must come from the same domain as the page including this file because of the same-origin
         * policy.
         *
         * Usage: printPdf(url)
         */
var printPdf = (function ()
{
    // Firefox requires a delay between loading the iframe and calling print(), otherwise it fails with an uncatchable
    // error. This makes it a rare case where user agent sniffing is justified.
    var isFirefox = /Gecko\/\d/.test(navigator.userAgent);

    // Specify the aforementioned delay for Firefox. 1000 seems to work. 100 is not enough.
    var firefoxDelay = 1000;

    var iframe;

    return function (url)
    {
        // Remove iframe from any previous call
        if (iframe)
        {
            iframe.parentNode.removeChild(iframe);
        }

        iframe = document.createElement("iframe");
        iframe.style.cssText = "width: 1px; height: 100px; position: fixed; left: 0; top: 0; opacity: 0; border-width: 0; margin: 0; padding: 0";

        var xhr = new XMLHttpRequest();
        try
        {
            xhr.responseType = "arraybuffer";
        } catch (e)
        {
            // This is probably IE 11, in which case we can go no further and just open the PDF in a new tab
            window.open(url, "_blank");
            return;
        }

        xhr.addEventListener("load", function ()
        {
            if (xhr.status === 200 || xhr.status === 201)
            {
                var pdfBlob = new Blob([xhr.response], { type: "application/pdf" });
                var iframeUrl = URL.createObjectURL(pdfBlob);
                iframe.src = iframeUrl;

                iframe.addEventListener("load", function ()
                {
                    function printIframe()
                    {
                        try
                        {
                            iframe.focus()
                            try
                            {
                                iframe.contentWindow.document.execCommand("print", false, null);
                            } catch (e)
                            {
                                iframe.contentWindow.print();
                            }
                        } catch (error)
                        {
                            console.error("Print failed: " + error, error);
                        } finally
                        {
                            iframe.style.visibility = "hidden";
                            iframe.style.left = "-1px";
                            URL.revokeObjectURL(iframeUrl);
                        }
                    }

                    // Add a delay for Firefox
                    if (isFirefox)
                    {
                        window.setTimeout(printIframe, firefoxDelay);
                    } else
                    {
                        printIframe();
                    }
                });

                document.body.appendChild(iframe);
            }
        });

        xhr.open("GET", url, true);
        xhr.send();
    };
})();