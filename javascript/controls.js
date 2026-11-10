import { state } from "./state.js"
import { regeneratePdf } from "./pipeline.js";
import { saveRotationCookie } from "./cookies.js";

const checked = document.querySelector(".rotational:checked");
if (checked) state.totalRot = Number(checked.value);

document.querySelectorAll(".rotational").forEach((radio) => {
    radio.addEventListener("change", () => {
        state.totalRot = Number(radio.value);
        saveRotationCookie(radio.value);
        regeneratePdf();
    });
});

document.getElementById("printLink").addEventListener("click", () => {
    if (!state.blob) return;
    printPdf(URL.createObjectURL(state.blob));
});
