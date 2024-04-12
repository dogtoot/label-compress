import { PDFDocument, degrees } from 'https://cdn.skypack.dev/pdf-lib@^1.11.1';

let allowCookies = false;

function getCookie(cname)
{
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++)
    {
        let c = ca[i];
        while (c.charAt(0) == ' ')
        {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0)
        {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

const body = document.body;
body.onload = function ()
{
    loadCookies();
}

function loadCookies()
{
    let cookiesDiv = document.getElementById("cookies");
    console.log("hello");
    if (getCookie("allowcookies") == "true")
    {
        allowCookies = true;
        cookiesDiv.hidden = true;
    }

    if (allowCookies == true)
    {
        let cookiePreset = getCookie("rotational");
        let rotational = document.getElementsByClassName("rotational");
        console.log(rotational);
        console.log(cookiePreset);
        for (let item of rotational)
        {
            if (cookiePreset != "" && document.title.includes("LabelCompress") && item.value == cookiePreset)
            {
                item.checked = true;
            }
        }

        console.log(rotational);

    }

    let imageWidthGlobal;
    let imageHeightGlobal;

    function base64ToArrayBuffer(base64)
    {
        var binaryString = atob(base64);
        var bytes = new Uint8Array(binaryString.length);
        for (var i = 0; i < binaryString.length; i++)
        {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    let file;
    let blob;
    let base64;
    let pdfBase64;

    async function rotatePDF(decodedData, width, height)
    {
        const fileInput = document.getElementById('file-pdf');
        if (!fileInput || !fileInput.files || fileInput.files.length === 0)
        {
            console.error('No file selected.');
            return;
        }
        const pdfDoc = await PDFDocument.create();
        decodedData = await decodedData.replace("data:image/png;base64,", "");
        pdfBase64 = decodedData;
        const pngImage = await pdfDoc.embedPng(base64ToArrayBuffer(decodedData));
        const pdfPage = pdfDoc.addPage([width, height]);
        pdfPage.drawImage(pngImage, {
            x: 0,
            y: 0,
            width: width,
            height: height
        });
        let rotationalEle = document.getElementsByClassName("rotational");
        let deg = 0;
        for (let item of rotationalEle)
        {
            if (item.checked)
            {
                deg = item.value;
            }
        }
        RotateCanvas(deg);
        for (let i = 0; i < pdfDoc.getPages().length; i++)
        {
            const page = pdfDoc.getPage(i);
            await page.setRotation(degrees(Number(deg)));
        }

        const modifiedPdfBytes = await pdfDoc.save();

        blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = "Output_" + file.name;
        downloadLink.style.display = 'block';

        const printLink = document.getElementById('printLink');
        printLink.style.display = 'block';
    }

    function readFileAsArrayBuffer(file)
    {
        return new Promise((resolve, reject) =>
        {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });
    }

    function addAlphaChannelToUnit8ClampedArray(unit8Array, imageWidth, imageHeight)
    {
        const newImageData = new Uint8ClampedArray(imageWidth * imageHeight * 4);

        for (let j = 0, k = 0, jj = imageHeight * imageWidth * 4; j < jj;)
        {
            newImageData[j++] = unit8Array[k++];
            newImageData[j++] = unit8Array[k++];
            newImageData[j++] = unit8Array[k++];
            newImageData[j++] = 255;
        }

        return newImageData;
    }

    async function getPageImages(pageNum, pdfDocumentInstance)
    {
        try
        {
            const pdfPage = await pdfDocumentInstance.getPage(pageNum);
            const operatorList = await pdfPage.getOperatorList();

            const validObjectTypes = [
                pdfjsLib.OPS.paintImageXObject, // 85
                pdfjsLib.OPS.paintImageXObjectRepeat, // 88
                pdfjsLib.OPS.paintJpegXObject //82
            ];

            operatorList.fnArray
                .forEach((element, idx) =>
                {
                    if (validObjectTypes.includes(element))
                    {
                        const imageName = operatorList.argsArray[idx][0];
                        console.log('page', pageNum, 'imageName', imageName);

                        pdfPage.objs.get(imageName, async (image) =>
                        {
                            const imageUnit8Array = image.data;
                            const imageWidth = image.width;
                            const imageHeight = image.height;
                            const imageUint8ArrayWithAlphaChanel = addAlphaChannelToUnit8ClampedArray(imageUnit8Array, imageWidth, imageHeight);
                            const imageData = new ImageData(imageUint8ArrayWithAlphaChanel, imageWidth, imageHeight);

                            const canvas = document.getElementById('canvas');
                            canvas.hidden = false;
                            canvas.width = imageWidth;
                            canvas.height = imageHeight;
                            imageHeightGlobal = imageHeight;
                            imageWidthGlobal = imageWidth;
                            const ctx = canvas.getContext('2d');
                            ctx.putImageData(imageData, 0, 0);
                            console.log('canvas > toDataURL', canvas.toDataURL());
                            const img = canvas.toDataURL();
                            base64 = img;
                            const aDownloadLink = document.createElement('a');

                            aDownloadLink.download = 'canvas_image.png';
                            aDownloadLink.href = img;
                            const decodedData = jsQR(imageUint8ArrayWithAlphaChanel, imageWidth, imageHeight);

                            if (decodedData)
                            {
                                const outputElement = document.getElementById('output');
                                outputElement.innerHTML += `${JSON.stringify(decodedData.data, null, 2)}\n`;
                                console.log('decodedData', decodedData.data);
                            }
                            rotatePDF(img, imageWidth, imageHeight);
                        });
                    }
                });
        } catch (error)
        {
            console.log(error);
        }
    }

    const onLoadFile = async event =>
    {
        try
        {
            const typedArray = new Uint8Array(event.target.result);

            const loadingPdfDocument = pdfjsLib.getDocument(typedArray);
            const pdfDocumentInstance = await loadingPdfDocument.promise;

            const totalNumPages = pdfDocumentInstance.numPages;
            const pagesPromises = [];

            for (let currentPage = 1; currentPage <= totalNumPages; currentPage += 1)
            {
                pagesPromises.push(getPageImages(currentPage, pdfDocumentInstance));
            }

            const pagesData = await Promise.all(pagesPromises);

        } catch (error)
        {
            console.log(error);
        }
    };
    let rotcanvas = 0;
    let input = document.getElementById('file-pdf');
    input.onclick = function ()
    {
        this.value = null;
    };

    input.addEventListener('input', event =>
    {
        file = event.target.files[0];
        document.getElementById("file-name").textContent = file.name;
        if (file.type !== 'application/pdf')
        {
            alert(`File ${file.name} is not a PDF file type`);
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = onLoadFile;
        fileReader.readAsArrayBuffer(file);
    });

    document.getElementById("printLink").addEventListener("click", event =>
    {
        printPdf(URL.createObjectURL(blob));
    });

    let padding_top = document.getElementById("canvas-padding-top");
    let padding_bottom = document.getElementById("canvas-padding-bottom");

    let preview = document.getElementById("preview");

    function RotateCanvas(rotcanvas)
    {
        let canv = document.getElementById("canvas");
        console.log(file);
        if (file != undefined)
        {
            let percent = "70%";
            if (window.innerHeight < 1200 && window.innerHeight > 600)
            {
                percent = "50%";
            }

            
            let canvasbox = document.getElementById("canvas-box");
            if(rotcanvas == 270 || rotcanvas ==90){
                canv.style.height = imageHeightGlobal * .5 + "px";
                canv.style.width = imageWidthGlobal * .5 + "px";
                canvasbox.style.height = canv.clientWidth + "px";
                canvasbox.style.width = canv.clientHeight + "px";
            }
            else{
                canv.style.height = imageHeightGlobal * .7 + "px";
                canv.style.width = imageWidthGlobal * .7 + "px";
                canvasbox.style.height = canv.clientHeight + "px";
                canvasbox.style.width = canv.clientWidth + "px";
            }

            canv.style.transform = "rotate(" + rotcanvas + "deg)";
            canv.style.transformOrigin = "50% 50%";
        }
        else if (file != undefined)
        {
            canv.style.height = imageHeightGlobal * .7 + "px";
            canv.style.width = imageWidthGlobal * .7 + "px";
            padding_top.style.height = "0px";
            padding_bottom.style.height = "0px";
        }
    }

    let allowCookiesbtn = document.getElementById("allow");
    let denyCookiesbtn = document.getElementById("dontallow");

    allowCookiesbtn.addEventListener('click', () =>
    {
        cookiesDiv.hidden = true;
        allowCookies = true;
        const expiry = new Date();
        expiry.setTime(expiry.getTime() + (120 * 24 * 60 * 60 * 1000));
        document.cookie = "allowcookies=" + allowCookies + ";" + "expires=" + expiry;
    })

    denyCookiesbtn.addEventListener('click', () =>
    {
        cookiesDiv.hidden = true;
    })

    var inputs = document.querySelectorAll("input[type=radio]"),
        x = inputs.length;
    while (x--)
        inputs[x].addEventListener("change", function ()
        {
            console.log("Checked: " + this.checked);
            console.log("Name: " + this.name);
            console.log("Value: " + this.value);
            console.log("Parent: " + this.parent);
            RotateCanvas(this.value);
            rotatePDF(pdfBase64, imageWidthGlobal, imageHeightGlobal);
            const expiry = new Date();
            expiry.setTime(expiry.getTime() + (120 * 24 * 60 * 60 * 1000));
            document.cookie = "rotational=" + this.value + ";" + "expires=" + expiry;
        }, 0);

    let rotationalEle = document.getElementsByClassName("rotational");
}