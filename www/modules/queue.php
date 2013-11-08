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
        <ul id="mondes-store"></ul>
        <div id="next-store"><img src="img/next_big.png"/></div>
    </div>
    <iframe id="viewer-store"></iframe>
    <div id="container-store">
        <div id="container-champs"></div>
        <div id="container-classification"></div>
    </div>
</div>

<div id="bucket-queue" class="bucket">
    <ul>
        <li id="modele-li-queue" class="idle">
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
    
    $("#poignee-queue").on("dragover", handle_drag);
    $("#poignee-queue").on("drop", handle_drop);
    
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
