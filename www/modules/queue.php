<div id="queue">
    <div id="container-queue">
        <div id="container-uploader">
            <div id="zone-dnd">
                <img src="img/cloud_30.png"/><br/>
                <b>Carga documentos en DINO</b>
                <input type="file" id="files-handler" name="files-handler" multiple="multiple" directory webkitdirectory mozdirectory > <!--  -->
            </div>
        </div>
        <div id="container-uploads">
            <div class="del-all">Borrar todo</div>
            <ul id="files-list"></ul>
        </div>
        <div id="container-uploads">
            <div class="del-all">Borrar todo</div>
            <ul id="files-list"></ul>
        </div>
    </div>
</div>

<div id="bucket-queue" class="bucket">
    <ul>
        <li id="modele-li-queue" class="queue_document" draggable="true">
            <img class="bouton-del-li" src="img/trash_15.png"/>
            <div class="filename"></div>
            <div class="progressbar"></div>
            <div class="details-queue"></div>
        </li>
    </ul>
</div>

<script type="text/javascript">    

    bootstrap_queue();
</script>
