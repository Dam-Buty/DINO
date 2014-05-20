<div id="queue" class="front-element">
    <div id="container-queue">
        <div id="container-uploader">
            <div id="zone-dnd">
                <p>Cargar</p>
                <div id="upload-buttons">
                    <input type="file" id="files-handler" name="files-handler" multiple="multiple"> <!--  -->
                    <div class="fake-button" id="files-button">Archivos</div>
                    <input type="file" id="dirs-handler" name="files-handler" multiple="multiple" directory webkitdirectory mozdirectory >
                    <div class="fake-button fake-dirs" id="dirs-button">Carpetas</div>
                    <div style="clear: both;"></div>
                </div>
            </div>
        </div>
        <div id="container-uploads">
           <!--<div class="pause-uploads">Pausar</div>
            <div class="cancel-uploads">Cancelar</div>
            -->
            <ul id="files-list"></ul>
        </div>
    </div>
</div>

<div id="tip-upload" class="dialog-box">
    <h1>Tu cuenta esta lista</h1>
    <div class="popup-ligne"><div class="popup-jauge jauge-100"></div></div>
    <p>Ahora puedes <b>cargar archivos o carpetas</b> en <b>DINO</b>.</p>
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
