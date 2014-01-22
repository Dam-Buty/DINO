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
    <div id="container-nav">
        <div id="prev-store" class="nav-store"></div>
        <img id="del-doc-store" src="img/del_back_30.png" title="Borrar documento"/>
        <div id="next-store" class="nav-store"></div>
    </div>
    <div id="nom-doc-store"></div>
    <iframe id="viewer-store"></iframe>
    <ul id="mondes-store" class="list-mondes"></ul>
    <div id="container-store">
        <div id="container-champs">
            <div class="entete-store"></div>
            <ul id="list-champs"></ul>
        </div>
        <div id="container-classification">
            <div class="entete-store"></div>
            <ul id="list-classification"></ul>
        </div>
        <div id="container-nouveau-champ">
        </div>
        <div id="container-details">
            <div id="champs-details"><input type="text" id="date-store"/>Fecha del documento : 
                <div id="input-detail">
                    <input type="text" id="detail-store"/>Detalle : 
                </div> <?php // LOCALISATION ?>
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
