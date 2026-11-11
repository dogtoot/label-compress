const EXPIRE_MS = 120 * 24 * 60 * 60 * 1000;

function setCookie(name, value) {
    const expires = new Date(Date.now() + EXPIRE_MS).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
    const hit = document.cookie
        .split("; ")
        .find((c) => c.startsWith(name + "="));
    return hit ? decodeURIComponent(hit.slice(name.length + 1)) : "";
}

export function saveRotationCookie(rot) {
    setCookie("rotational", rot);
}

function loadCookies() {
    const isCompress = document.title.includes("Compress - ");
    const isInstructions = document.title.includes("Instructions - ");

    if (isCompress) {
        const saved = getCookie("rotational");
        const radios = [...document.getElementsByClassName("rotational")];
        const match = radios.find((r) => r.value === saved);
        (match ?? document.getElementById("first")).checked = true;
    }

    const dark = getCookie("darkmode") === "true";
    const slider = document.getElementById("slider");
    slider.checked = dark;
    document.getElementById("bodyID").classList.toggle("darkmode", dark);
    document.documentElement.classList.toggle("darkmode", dark);
    document.getElementById("titleH1").classList.toggle("darkmodetitle", dark);
    document.getElementById("labelforslider").textContent = dark
        ? "Disable Darkmode"
        : "Enable Darkmode";

    if (isInstructions) {
        const link = document.getElementById("link");
        link.classList.toggle("darklink", dark);
        link.classList.toggle("link", !dark);
    }

    slider.addEventListener("click", () => {
        setCookie("darkmode", slider.checked);
        document.documentElement.classList.toggle("darkmode", slider.checked);
    });
}

loadCookies();
