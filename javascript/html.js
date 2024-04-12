function openFileDialogue(){
    let fileDialogue = document.getElementById("file-btn");
    fileDialogue.click();
}

let canvas = document.getElementById("canvas");

canvas.addEventListener("change", event => {
    footer();
});

function footer(){

    if(canvas.clientWidth >= 100){
        let footer = document.getElementById("footer");
        footer.style.position = "static";
    }
}