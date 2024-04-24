let allowCookies = false;

let cookiesDiv = document.getElementById("cookies");
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
    console.log("hello");
    if (getCookie("allowcookies") == "true")
    {
        allowCookies = true;
        cookiesDiv.hidden = true;
    }
    else
    {
        cookiesDiv.hidden = false;
    }

    if (allowCookies == true && document.title.includes("Compress - "))
    {
        let cookiePreset = getCookie("rotational");
        let rotational = document.getElementsByClassName("rotational");
        console.log(rotational);
        console.log(cookiePreset);
        for (let item of rotational)
        {
            if (cookiePreset != "" && document.title.includes("Compress - ") && item.value == cookiePreset)
            {
                item.checked = true;
            }
            else
            {
                document.getElementById("first").checked = true;
            }
        }
        console.log(rotational);
    }
    else if(document.title.includes("Compress - "))
    {
        document.getElementById("first").checked = true;
    }

    if(allowCookies == true){
        let cookiePreset = getCookie("darkmode");
        if(cookiePreset == "true"){
            document.getElementById("bodyID").classList.add('darkmode');
            document.getElementById("labelforslider").textContent = "Disable Darkmode"
            document.getElementById("slider").checked = true;
        }
        else{
            document.getElementById("bodyID").classList.remove('darkmode');
            document.getElementById("labelforslider").textContent = "Enable Darkmode"
            document.getElementById("slider").checked = false;
        }
    }
}

document.getElementById("slider").addEventListener('click', () =>
{
    CreateDarkmodeCookie();
})

function CreateDarkmodeCookie(){
    if (allowCookies == true)
    {
        console.log(slider.checked);
        const expiry = new Date();
        expiry.setTime(expiry.getTime() + (120 * 24 * 60 * 60 * 1000));
        document.cookie = "darkmode=" + slider.checked + ";" + "expires=" + expiry;
    }
}