<div id="container-queue" data-state="closed" class="principal">
    <div id="container-uploads">
        <div id="del-all">Borrar todo</div>
        <ul id="files-list"></ul>
    </div>
    <div id="container-uploader">
        <div id="zone-dnd">
            <img src="img/cloud_30.png"/><br/>
            <b>Carga documentos en DINO</b>
            <input type="file" id="files-handler" name="files-handler" multiple="multiple" directory webkitdirectory mozdirectory>
        </div>
    </div>
</div>

<div id="bucket-queue" class="bucket">
    <ul>
        <li id="modele-li-queue" class="idle" draggable="true">
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
