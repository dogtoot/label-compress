import { state } from "./state.js";
import { regeneratePdf, refresh } from "./pipeline.js";
import { saveRotationCookie } from "./cookies.js";
import { initCrop, redrawCrop } from "./crop.js";

initCrop(regeneratePdf);

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

let auto_crop_btn = document.getElementById("auto-crop");
let manu_crop_btn = document.getElementById("manu-crop");
let crop_fieldset = document.getElementById("fieldset-crop");
let save_btn = document.getElementById("save-preset");
let delete_btn = document.getElementById("delete-preset");
let select_preset = document.getElementById("presets");

/*window.addEventListener("load", () => {
    manu_crop_btn.disabled = false;
    auto_crop_btn.disabled = true;
    crop_fieldset.disabled = true;
    state.mode = "auto";

    const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith("preset:"),
    );

    let active_preset = null;
    keys.forEach((preset) => {
        let preset_name = preset.replace("preset:", "");
        const new_preset = new Option(preset_name);
        select_preset.add(new_preset, 0);
        active_preset = preset;
    });
    if (active_preset !== "Default") {
        let crop = localStorage.getItem(active_preset);
        console.log(crop);
        if (!crop) {
            alert("Unable to retrieve preset.");
            return;
        }

        state.crop = crop;
    } else {
        state.crop = { x: 0, y: 0, h: 1, w: 1 };
    }
    redrawCrop();
});*/
auto_crop_btn.addEventListener("click", () => {
    manu_crop_btn.disabled = false;
    auto_crop_btn.disabled = true;
    crop_fieldset.disabled = true;
    state.mode = "auto";
    refresh();
});

manu_crop_btn.addEventListener("click", () => {
    auto_crop_btn.disabled = false;
    manu_crop_btn.disabled = true;
    crop_fieldset.disabled = false;
    state.mode = "manual";
    refresh();
});

const PREFIX = "preset:";
const LAST_KEY = "lastPreset";
const FULL = { x: 0, y: 0, w: 1, h: 1 };

function loadCrop(name) {
    if (name === "Default") return { ...FULL };
    try {
        const crop = JSON.parse(localStorage.getItem(PREFIX + name));
        const ok = crop && ["x", "y", "w", "h"].every((k) => Number.isFinite(crop[k]));
        return ok ? crop : null;
    } catch {
        return null;
    }
}

function addPresetOption(name, select = false) {
    const existing = [...select_preset.options].find((o) => o.text === name);
    const opt = existing ?? new Option(name);
    if (!existing) select_preset.add(opt, 0);
    if (select) opt.selected = true;
}

function applyPreset(name) {
    const crop = loadCrop(name);
    if (!crop) {
        alert("Unable to retrieve preset.");
        return false;
    }
    state.crop = crop;
    localStorage.setItem(LAST_KEY, name);
    redrawCrop();
    regeneratePdf();
    return true;
}

for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(PREFIX)) addPresetOption(key.slice(PREFIX.length));
}
const last = localStorage.getItem(LAST_KEY);
const lastOpt = [...select_preset.options].find((o) => o.text === last);
if (lastOpt) {
    lastOpt.selected = true;
    state.crop = loadCrop(last);
}


save_btn.addEventListener("click", () => {
    const name = prompt("Name your crop preset:")?.trim();
    if (!name || name === "Default") return;
    localStorage.setItem(PREFIX + name, JSON.stringify(state.crop));
    localStorage.setItem(LAST_KEY, name);
    addPresetOption(name, true);
});

select_preset.addEventListener("change", () => {
    applyPreset(select_preset.options[select_preset.selectedIndex].text);
});

delete_btn.addEventListener("click", () => {
    const opt = select_preset.options[select_preset.selectedIndex];
    const name = opt.text;

    if (name === "Default") {
        alert("You cannot delete the default preset.");
        return;
    }
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    localStorage.removeItem("preset:" + name);
    opt.remove();
    if (localStorage.getItem("lastPreset") === name) localStorage.removeItem("lastPreset");

    const def = [...select_preset.options].find((o) => o.text === "Default");
    if (def) def.selected = true;
    state.crop = { x: 0, y: 0, w: 1, h: 1 };
    redrawCrop();
    regeneratePdf();
});