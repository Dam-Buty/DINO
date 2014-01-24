<div id="container-queue" data-state="closed">
    <div id="tiroir-queue">
        <div id="zone-dnd">
            <img src="img/cloud_30.png"/><br/>
            Deposita documentos aqui<br/>para subirlos!
        </div>
        <div id="container-files-handler">
            <input type="file" id="files-handler" name="files-handler" multiple="multiple">
        </div>
        <div id="del-all">Borrar todo</div>
        <div id="div-list"><ul id="files-list"></ul></div>
    </div>
</div>

<div id="popup-store" data-document="">
    <ul id="list-champs"></ul>
    <div id="container-nav">
        <div id="prev-store" class="nav-store"></div>
        <img id="del-doc-store" src="img/del_back_30.png" title="Borrar documento"/>
        <div id="next-store" class="nav-store"></div>
    </div>
    <div id="nom-doc-store"></div>
    <iframe id="viewer-store"></iframe>
    <ul id="mondes-store" class="list-mondes"></ul>
    <div id="container-store">
        <div id="container-nouveau-champ">
        </div>
        <div id="container-classification">
            <div class="entete-store" id="entete-classification"></div>
            <ul class="classif" id="list-classification"></ul>
            <div class="entete-store" id="entete-time"></div>
            <ul class="classif" id="list-time"></ul>
        </div>
        <div id="container-details">
            <div class="ligne-details" id="container-date">
                <div class="cell-details">
                    Fecha del documento : 
                </div>
                <div class="cell-details">
                    <input type="text" id="date-store"/>
                </div>
            </div>
            <div class="ligne-details" id="container-detail">
                <div class="cell-details">
                    Detalle : 
                </div>
                <div class="cell-details">
                    <input type="text" id="detail-store"/>
                </div>
            </div>
            <div class="boutons" id="bouton-store">Archivar en DINO</div>
        </div>  
    </div>
    <div style="clear: both;"></div> 
</div>

<div id="bucket-queue" class="bucket">
    <ul>
        <li id="modele-li-queue" class="idle" draggable="true">
            <img class="bouton-del-li" src="img/del_15.png"/>
            <img class="bouton-edit-li" src="img/edit_30.png"/>
            <div class="filename"></div>
            <div class="progressbar"></div>
            <div class="details-queue"></div>
        </li>
    </ul>
</div>

<script type="text/javascript">    

    bootstrap_queue();
</script>
