// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
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
    //ToggleDarkMode();
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
    /*if(allowCookies == true){
        let cookiePreset = getCookie("preset");
        let vaildCookie = false;
        if(cookiePreset != "" && document.title.includes("Home")){
            switch (cookiePreset){
                case "mercari": deg270.checked = true; vaildCookie = true; break;
                case "ebay": deg0.checked = true; vaildCookie = true; break;
                case "amazon": deg0.checked = true; vaildCookie = true; break;
                default: console.log("Cookies failed."); vaildCookie = false;
            }
            if(vaildCookie){
                let selectPreset = document.getElementById(cookiePreset);
                console.log(cookiePreset);
                selectPreset.classList.toggle('active');
            }
        }
    }*/
    /*if(allowCookies == true){
        let cookieDarkmode = getCookie("darkmode");
        let vaildDarkmode = false;
        let slider = document.getElementById("slider");
        if(cookieDarkmode != ""){
            switch (cookieDarkmode){
                case "true": slider.checked = true; break;
                case "false": slider.checked = false; break;
                default: console.log("Cookies failed."); vaildDarkmode = false;
            }
        }
    }*/
}