<div id="container-queue" data-state="closed">
    <div id="tiroir-queue">
        <div id="zone-dnd">
            <img src="img/cloud_30.png"/><br/>
            Deposita documentos aqui<br/>para subirlos!
        </div>
        <div id="container-files-handler">
            <input type="file" id="files-handler" name="files-handler" multiple="multiple">
        </div>
        <div id="div-list"><ul id="files-list"></ul></div>
    </div>
</div>

<div id="popup-store" data-document="">
    <div id="prev-store" class="nav-store"></div>
    <div id="next-store" class="nav-store"></div>
    <iframe id="viewer-store"></iframe>
    <ul id="mondes-store" class="list-mondes"></ul>
    <div id="container-store">
        <div id="container-champs"></div>
        <hr/>
        <ul id="container-classification"></ul>
        <div id="container-details">
        <hr/>
            <div id="champs-details"><input type="text" id="date-store"/>Fecha del documento : 
                <div id="input-detail">
                    <input type="text" id="detail-store"/>Detalle : 
                </div> <?php // LOCALISATION ?>
            </div>
            <div class="boutons" id="bouton-store">Archivar en DINO</div>
        </div>
    </div>
</div>

<div id="bucket-queue" class="bucket">
    <ul>
        <li id="modele-li-queue" class="idle" draggable="true">
            <img class="bouton-edit-li" src="img/edit_20.png"/>
            <img class="bouton-del-li" src="img/del_20.png"/>
            <div class="filename"></div>
            <div class="progressbar"></div>
            <div class="details-queue"></div>
        </li>
    </ul>
</div>

<script type="text/javascript">    
    
    $.ajax({ url: "json/queue.php" })
    .done(function (data) {
        $.each(data.queue, function() {
            var document_li = set_li_status(create_li(this.displayname, this.size, this.user, this.date), 1);
            this.li = document_li;
            queue.push(this);
        });
        refresh_liste();
    });
    
    $("#files-handler").change(handle_files);
</script>
