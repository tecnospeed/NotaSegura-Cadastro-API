function openTab(evt, Name) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("nav-link");
    console.log(tablinks)
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    tabitem = document.getElementsByClassName("nav-item active");
    for (i = 0; i < tabitem.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    document.getElementById(Name).style.display = "block";
    tablinks[evt].className += " active";
}


var tab,bbo,a;
tab = document.getElementsByClassName("nav-link");
for (a = 0; a < tab.length; a++) 
    if(tab[a].className.search(/ active/) != -1) bbo = true;

if(bbo != true)
{
    openTab(0,'dados-clientes')    
}
