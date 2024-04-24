document.getElementById("slider").addEventListener('click', () =>
{
    EnableDarkMode();
})


function EnableDarkMode()
{
    let darkmode = false;
    var slider = document.getElementById("slider");
    console.log(slider.checked);
    if (slider.checked == true)
    {
        document.getElementById("bodyID").classList.add('darkmode');
        document.getElementById("labelforslider").textContent = "Disable Darkmode"
    }
    else
    {
        document.getElementById("bodyID").classList.remove('darkmode');
        document.getElementById("labelforslider").textContent = "Enable Darkmode"
    }

}