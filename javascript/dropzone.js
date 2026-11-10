import { els } from "./dom.js";
import { resetTextColor } from "./darkmode.js";
import { handleFile } from "./pipeline.js";

function setDropzoneActive(active) {
    els.textCenter.classList.toggle("dropzone", active);
    if (active) els.textCenter.style.color = "black";
    else resetTextColor();
    els.dropzoneTitle.hidden = !active;
    els.textBreak.hidden = active;
}

function getDroppedFile(ev) {
    const item = [...ev.dataTransfer.items].find((i) => i.kind === "file");
    return item ? item.getAsFile() : null;
}

els.textCenter.classList.remove("dropzone");

els.textCenter.addEventListener("dragover", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    setDropzoneActive(true);
});

els.textCenter.addEventListener("drop", (event) => {
    ev.preventDefault();
    setDropzoneActive(false);

    const file = getDroppedFile(ev);
    if (!file) return;

    const dt = new DataTransfer();
    dt.items.add(file);
    els.fileInput.files = dt.files;
    handleFile(file);
});

els.bodyId.addEventListener("dragover", () => setDropzoneActive(false));

els.fileInput.onclick = function () {
    this.value = null;
};

els.fileInput.addEventListener("change", (ev) => {
    const file = ev.target.files[0];
    if (file) handleFile(file);
});