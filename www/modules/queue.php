<div id="queue" class="front-element">
    <div id="container-queue">
        <div id="container-uploader">
            <div id="zone-dnd">
                <p>Cargar</p>
                <div id="upload-buttons">
                    <div class="fake-button button-gradient" id="files-button">Archivos</div>
                    <div class="fake-button fake-dirs button-gradient" id="dirs-button">Carpetas</div>
                    <div style="clear: both;"></div>
                    <input type="file" id="files-handler" name="files-handler" multiple="multiple"> <!--  -->
                    <input type="file" id="dirs-handler" name="files-handler" multiple="multiple" directory webkitdirectory mozdirectory >
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
    <h1>Carga tus facturas en DINO</h1>
    <div class="popup-ligne"><div class="popup-jauge jauge-100"></div></div>
    <p>Felicidades! Tu cuenta <b>DINO</b> esta lista para usarse.</p>
    <p>Vamos a organizar juntos tus primeres documentos, empezando con un gran clasico : tus <b>facturas</b>.</p>
    <p>Da click en "<b>Archivos</b>" o "<b>Carpetas</b>" para cargar tus <b>facturas</b> desde tu disco duro.</p>
</div>

<div id="tip-store" class="dialog-box">
    <h1>Organiza tus facturas</h1>
    <div class="popup-ligne"><div class="popup-jauge jauge-100"></div></div>
    <p>Muy bien! Puedes ver que <b>DINO</b> empezo a trabajar con tus documentos, clasificandolos por tipo de archivo.</p>
    <p>Ahora vamos a <b>clasificar</b> tus <b>facturas</b>, atribuyendolas a sus clientes respectivos.</p>
    <p>Da click en uno de tus documentos para empezar a clasificarlo.</p>
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
