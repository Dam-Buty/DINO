<div id="container-queue" data-state="closed">
    <div id="poignee-queue"></div>
    <div id="tiroir-queue">
        <h1>Fila <input type="file" id="files-handler" name="files-handler" multiple="multiple"></h1>
        <div id="div-list"><ul id="files-list"></ul></div>
    </div>
</div>

<div id="popup-store" data-document="">
    <div id="top-store">
        <div id="prev-store"><img src="img/prev_big.png"/></div>
        <ul id="mondes-store" class="list-mondes"></ul>
        <div id="next-store"><img src="img/next_big.png"/></div>
    </div>
    <iframe id="viewer-store"></iframe>
    <div id="container-store">
        <div id="container-champs"></div>
        <hr/>
        <ul id="container-classification"></ul>
        <hr/>
        <div id="container-details">
            Fecha del documento : <input type="text" id="date-store"/><br/>
            <div id="input-detail">
                Detalle : <input type="text" id="detail-store"/>
            </div> <?php // LOCALISATION ?>
            <div class="boutons" id="bouton-store">Archivar el documento</div>
        </div>
    </div>
</div>

<div id="bucket-queue" class="bucket">
    <ul>
        <li id="modele-li-queue" class="idle" draggable="true">
            <span class="filename"></span> - 
            <span>En fila</span>
            <span class="boutons-li">
                <img class="bouton-edit-li" src="img/edit.png"/>
                <img class="bouton-del-li" src="img/del.png"/>
            </span>
        </li>
    </ul>
</div>

<script type="text/javascript">
    $("#poignee-queue").click(anime_queue);
    $("#files-handler").change(handle_files);
    
    $("#date-store").datepicker({dateFormat: "dd/mm/yy"});
    $("#date-store").datepicker('setDate', new Date());
    
    $.ajax({ url: "json/queue.php" })
    .done(function (data) {
        $.each(data.queue, function() {
            var document_li = set_li_status(create_li(this.displayname), 1);
            this.li = document_li;
            queue.push(this);
        });
        refresh_liste();
    });
</script>
