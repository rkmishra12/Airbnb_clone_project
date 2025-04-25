let texSwitch = document.getElementById("flexSwitchCheckeDefault");
texSwitch.addEventListener("click",()=>{
    let texInfo = document.getElementsByClassName("tax-info");
    for(info of texInfo){
        if(info.style.display != "inline"){
            info.style.display = "inline";
        }else{
            info.style.display = "none";
        }
    }
}); 