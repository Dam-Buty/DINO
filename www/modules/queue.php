<div id="container-queue" data-state="closed">
    <div id="poignee-queue"></div>
    <div id="tiroir-queue">
        <h1>Fila <input type="file" id="files-handler" name="files-handler" multiple="multiple"></h1>
        <div id="div-list"><ul id="files-list"></ul></div>
    </div>
</div>

<div id="bucket_queue" class="bucket">
    <ul>
        <li id="modele_li_queue" class="idle">
            <span class="filename"></span> - 
            <span>En fila</span>
            <span class="boutons_queue">
                <img id="bouton_edit_queue" src="img/edit.png"/>
                <img id="bouton_del_queue" src="img/del.png"/>
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
            refresh_liste();
        });
    });
</script>
