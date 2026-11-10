import { els } from "./dom.js"

document.getElementById("slider").addEventListener('click', () =>
{
    EnableDarkMode();
})


function EnableDarkMode()
{
    var slider = document.getElementById("slider");
    console.log(slider.checked);
    if (slider.checked == true)
    {
        document.getElementById("bodyID").classList.add('darkmode');
        document.getElementById("titleH1").classList.add("darkmodetitle");
        document.getElementById("labelforslider").textContent = "Disable Darkmode"

        if(document.title.includes("Instructions - ")){
            document.getElementById("link").classList.remove("link");
            document.getElementById("link").classList.add("darklink");
        }
    }
    else
    {
        document.getElementById("bodyID").classList.remove('darkmode');
        document.getElementById("titleH1").classList.remove("darkmodetitle");
        document.getElementById("labelforslider").textContent = "Enable Darkmode"

        if(document.title.includes("Instructions - ")){
            document.getElementById("link").classList.remove("darklink");
            document.getElementById("link").classList.add("link");
        }
    }

}

export function resetTextColor(){
    els.textCenter.style.color = els.body.classList.contains("darkmode")
        ? "rgb(211, 211, 211)" : "black";
}

els.slider.addEventListener("change", (event) => {
    resetTextColor();
});