var ligneOuverte, liasseOuverte;
var leCancel = 0;

function AddBefore(leRow){
    var newElement = document.createElement('tr');
    leRow.parentNode.insertBefore(newElement, leRow);
    return newElement;
}

function AddAfter(leRow){
    var newElement = document.createElement('tr');
    leRow.parentNode.insertBefore(newElement, leRow.nextSibling );
    return newElement;
}

function AddCell(leRow) {
    var newElement = document.createElement('td');
    leRow.appendChild(newElement);
    return newElement;
}

function recharge() {    
    var xmlhttp;
    
    lesLignes = document.getElementsByName("ligne_ope");
    
    for (var i = 0; i < lesLignes.length;i++) {
        laLigne = lesLignes[i];
        laLigne.className = "ligne_ope_loading";
    }
    	
    var leForm = document.forms['leForm'];
    
    var leTri = leForm.tri.value;
    var lOrdre = leForm.ordre.value;
    var leDefaut = leForm.defaut.value;

    var laPage = leForm.page.value;
    var lesItems = leForm.items.value;

    var laRef = leForm.ref_unique.value;
    
    if (leForm.client != undefined) {
        var leClient = leForm.client.value;
    } else {
        var leClient = "";
    }
    
    if (leForm.douane != undefined) {
        var laDouane = leForm.douane.value;
    } else {
        var laDouane = "";
    }
    
    var laDateDebut = leForm.date_debut.value;
    var laDateFin = leForm.date_fin.value;
    
    // remise à zéro des liasses ouvertes
    ligneOuverte = null;
    liasseOuverte = null;
    
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4) {
            if (xmlhttp.status==200) {
                document.getElementById("tableau").innerHTML = xmlhttp.responseText;    
                leMax = document.getElementById("retour_maxitems").value;
                recharge_pagination(leMax);
            }
        }
    }
        
    var url = "do/doTab.php?tri=" + leTri + "&ordre=" + lOrdre + "&defaut=" + leDefaut + "&page=" + laPage + "&items=" + lesItems + "&ref=" + laRef;
    
    url += "&debut=" + laDateDebut + "&fin=" + laDateFin;
    
    url += "&douane=" + laDouane + "&client=" + leClient;
	
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function trie(leTri) {    
    var leForm = document.forms['leForm'];
    
    leForm.defaut.value = 0;
    
    
    if (leTri == leForm.tri.value) {
        // Si on clique sur une colonne deja triée on inverse l'ordre
        if (leForm.ordre.value == "ASC") {
            leForm.ordre.value = "DESC";
        } else {
            leForm.ordre.value = "ASC";        
        }
        
    } else {
        // sinon on change de colonne de tri et on passe en ASC
        leForm.tri.value = leTri;
        leForm.ordre.value = "ASC";
    }
    
    recharge();
    
}

function change_page(leSens) {
    var leForm = document.forms['leForm'];
    var laPage = leForm.page;    
    var valeurPage = laPage.value * 1;
    
    switch(leSens) {
        case "-1":
            laPage.value = valeurPage - 1; 
            break;
        case "+1":
            laPage.value = valeurPage + 1; 
            break;
        case "1":            
            laPage.value = 1; 
            break;
        default:
            laPage.value = leSens;
            break;
    }
    
    recharge();
}

function change_items(leSelect) {    
    var leForm = document.forms['leForm'];
    var lesItems = leForm.items;
    var laPage = leForm.page;
    
    lesItems.value = leSelect.value;
    
    laPage.value = 1;
    
    recharge();
}

function change_fleche(leTD, leSens) {
    if (leSens == "open") {
        if (leTD.className == "arrow") {
            leTD.className="arrow-down";        
        }
        else {
            leTD.className="arrow2-down";        
        }
    }
    else {
        if (leTD.className == "arrow-down") {
            leTD.className="arrow";        
        }
        else {
            leTD.className="arrow2";        
        }
    }
}

function ferme_ligne(lePK) {
    var laTable = document.getElementById("tab_global");
    
    // On commence par fermer la liasse ouverte s'il y en a une
    if (liasseOuverte != null) {
        ferme_liasse(liasseOuverte, lePK);
    }
    
    // puis on supprime les trois lignes de liasse    
    lesLignes = document.querySelectorAll(".ligne_liasse_" + lePK);  
//    console.log(lesLignes);
    
//    lesLignes2 = document.getElementsByClassName("ligne_liasse_" + lePK);  
//    console.log(lesLignes2);
    
    taille = lesLignes.length;
    
    for (index = 0; index < taille; ++index) {
        elem = lesLignes[index];
        elem.parentNode.removeChild(elem);
    }
    
    // puis on marque la ligne en non ouverte
    leRow = document.getElementById("operation_" + lePK);
    leRow.className = "ligne_ope";
    ligneOuverte = null;
    
    leTD = document.getElementById("fleche_" + lePK);    
    change_fleche(leTD, "close")
}

function ouvre_ligne(leRow, lePK) {
    if (!leCancel) {        
        leRow.className = "ligne_ope_1";        
        
        var laDerniereLigne = leRow;
        
        for (var i = 0; i < lesLiasses.length; i++) {
            var laNouvelleLigne = AddAfter(laDerniereLigne);
            
            var numLiasse = lesLiasses[i].split(" - ")[0];
            var nomLiasse = lesLiasses[i].split(" - ")[1];
            
            laNouvelleLigne.className = "ligne_liasse_" + lePK;
            laNouvelleLigne.id = lePK + "_" + numLiasse;
            
            laCellule = AddCell(laNouvelleLigne);
            
            laCellule.id = "fleche_" + numLiasse + "_" + lePK + ""
            laCellule.className = "arrow2";
            laCellule.colSpan = "4";
            laCellule.onclick =  function (liasse, pk) { 
                                    return function () { change_liasse(this, liasse, pk); }
                                } (numLiasse, lePK);
            laCellule.innerHTML = numLiasse + " - " + nomLiasse;
            
            laDerniereLigne = laNouvelleLigne;
        }
        
        ligneOuverte = lePK;        
        
        leTD = document.getElementById("fleche_" + lePK);
        
        change_fleche(leTD, "open");
    }
    else {
        leCancel = 0;
    }
}

function change_ligne(leRow, lePK) {
    if (leRow.className == "ligne_ope") {
        // si il y a une ligne ouverte, on la ferme
        if (ligneOuverte != null) {
            ferme_ligne(ligneOuverte);
        }
        ouvre_ligne(leRow, lePK);
    }
    else {
        ferme_ligne(lePK);
    }
}

function ferme_liasse(laLiasse, lePK) {
    var laTable = document.getElementById("tab_global");
    var lesLignes = document.querySelectorAll(".ligne_document_" + laLiasse + "_" + lePK);
    
    var taille = lesLignes.length;
    
    for (index = 0; index < taille; ++index) {
        elem = lesLignes[index];
        elem.parentNode.removeChild(elem);
    }
    
    // Si il existe une ligne 'nodoc', on l'efface aussi
    elem = document.getElementById("ligne_nodoc");
    
    if (elem != null) {
        elem.parentNode.removeChild(elem);
    }
    
    liasseOuverte = null;
    
    var leTD = document.getElementById("fleche_" + laLiasse + "_" + lePK);
    
    leTD.parentNode.style.backgroundColor = "";
    change_fleche(leTD, "close");
}

function ouvre_liasse(leRow, laLiasse, lePK) {
    var xmlhttp;
    
    // on change la couleur de la ligneOuverte
    leRow.parentNode.style.backgroundColor = "#5DC43D";
    
    var leTD_fleche = document.getElementById("fleche_" + laLiasse + "_" + lePK);
    
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4) {
            if (xmlhttp.status==200) {
                var leTab = eval(xmlhttp.responseText.replace("Array", ""));
                
                var leParent = leRow.parentNode;
                
                for (var index = 0; index < leTab.length; ++index) {
                    var laLigneDoc = AddAfter(leParent);
                    
                    laLigneDoc.className = "ligne_document_" + laLiasse + "_" + lePK;
                    laLigneDoc.id = "doc_" + leTab[index][0];
                    
                    laCellule = AddCell(laLigneDoc);
                    
                    laCellule.style.paddingLeft = "50px";
                    laCellule.colSpan = "4";
                    
                    laCellule.innerHTML = "<a href='javascript:void(0);' onclick='return ouvre_doc(\"" + leTab[index][0] + "\");'>" + leTab[index][1] + "</a>";
                    
                    leParent = laLigneDoc;
                }
                
                liasseOuverte = laLiasse;
                change_fleche(leTD_fleche, "open");
            }
            else if (xmlhttp.status==204 || xmlhttp.status == 1223) {
                leParent = leRow.parentNode;
                
                var laLigneDoc = AddAfter(leParent);
                
                laLigneDoc.className = "ligne_nodoc";
                laLigneDoc.id = "ligne_nodoc";
                
                laCellule = AddCell(laLigneDoc);
                
                    laCellule.style.paddingLeft = "50px";
                laCellule.colSpan = "4";
                                        
                laCellule.innerHTML = "No hay documentos por esta parte.";
                
                liasseOuverte = laLiasse;
                change_fleche(leTD_fleche, "open");
            }
        }
    }
    
    url = "do/doLine.php?pk=" + lePK + "&liasse=" + laLiasse;
    
    leTD_fleche.className = "loading";
    
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function change_liasse(leRow, laLiasse, lePK) {
    // Si on a deja une liasse ouverte
    if (liasseOuverte != null) {
        // Si c'est celle qu'on veut fermer
        if (liasseOuverte == laLiasse) {
            ferme_liasse(laLiasse, lePK);
        }
        else {
            ferme_liasse(liasseOuverte, lePK);
            ouvre_liasse(leRow, laLiasse, lePK);
        }
    }
    else {
        ouvre_liasse(leRow, laLiasse, lePK);
    }
}

function ouvre_doc(leDoc) {
    var laFrame = document.getElementById("viewer");
    var leDiv = document.getElementById("div_viewer");

    leDiv.style.display = "block";
    laFrame.src = "do/doDoc.php?leDoc=" + leDoc;

}

function ferme_doc() {
    laFrame = document.getElementById("viewer");
    leDiv = document.getElementById("div_viewer");
    
    
    laFrame.src = "";
    leDiv.style.display = "none";
}

function recharge_pagination(leMax) {
    var leDiv = document.getElementById("detail_pagination");    
    var leForm = document.forms['leForm'];
    
    var laPage = leForm.page.value;
    var lesItems = leForm.items.value;
    
    var nbPages = Math.ceil(leMax/lesItems);
    
    var laSortie = "";
    
    
    if (laPage != 1) {
        laSortie += "<a href=\"javascript:void(0);\" onclick=\"change_page('1');\"><img src='img/first.png'></a>";
    } else {
        laSortie += "<img src='img/no_first.png'>";
    }
    
    laSortie += " ";
    
    if (laPage != 1) {
        laSortie += "<a href=\"javascript:void(0);\" onclick=\"change_page('-1');\"><img src='img/previous.png'></a>";
    } else {
        laSortie += "<img src='img/no_previous.png'>";
    }
    
    laSortie += " " + laPage + " / " + nbPages + " ";
    
    if (laPage < nbPages) {
        laSortie += "<a href=\"javascript:void(0);\" onclick=\"change_page('+1');\"><img src='img/next.png'></a>";        
    } else {
        laSortie += "<img src='img/no_next.png'>";
    }
    
    laSortie += " ";
    
    if (laPage < nbPages) {
        laSortie += "<a href=\"javascript:void(0);\" onclick=\"change_page('" + nbPages + "');\"><img src='img/last.png'></a>";        
    } else {
        laSortie += "<img src='img/no_last.png'>";
    }
    
    laSortie += "<br>";
    laSortie += "<i>" + leMax + " operaciones total.</i>";
    laSortie += "<br>";
    laSortie += "<select name='nb_items' id='nb_items' onchange='change_items(this)'>";
    
    selected10 = "";
    selected50 = "";
    selected100 = "";
    selectedmax = "";
    
    switch (lesItems) {
        case "10":
            selected10 = " selected";
            break;
        case "50":
            selected50 = " selected";
            break;
        case "100":
            selected100 = " selected";
            break;
        default:
            selectedmax = " selected";
            break;
    }
    
    laSortie += "<option value='10'" + selected10 + ">10</option>";
    laSortie += "<option value='50'" + selected50 + ">50</option>";
    laSortie += "<option value='100'" + selected100 + ">100</option>";
    laSortie += "<option value='" + leMax + "'" + selectedmax + ">Todos</option>";
    
    leDiv.innerHTML = laSortie;
}
