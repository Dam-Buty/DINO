<!--LOCALISATION-->
<div id="mondes-suppr" class="admin">
    <h1>Supresion de mundo</h1>
    <span class="warning">Borrar un mundo es una accion irreversible y de alto impacto!</span><br/>
    <div id="choix-mondes-suppr">
        <div>Elige un mundo
            <ul class="list-mondes" id="liste-mondes-suppr"></ul>
        </div>
    </div>
    <div id="action-mondes-suppr">
        <p id="tag-mondes-suppr">Mundo <b class="nom-monde"></b></p>
        <p id="bilan-mondes-suppr">Que quieres hacer con los documentos relacionados?</p>
        <div class="designer-option option-ko" id="option-supprimer">
            <h1>Borrar</h1>
            <p>Borrar <i><b>definitivamente</b></i> los <b class="nb-docs-bilan"></b> documentos.</p>
            <p>Se liberaran <b class="space-bilan"></b> de espacio.</p>
        </div>
        <div class="designer-option option-ko" id="option-declass">
            <h1>Declasificar</h1>
            <p>Declasificar los <b class="nb-docs-bilan"></b> documentos.</p>
            <p>Regresaran en tu fila de espera.</p>
        </div>
        <div style="clear: both;"></div>
        <p id="bouton-mondes-suppr" class="boutons">Confirmar</p>
    </div>
    <div id="no-action-suppr">
        <p>El Mundo <b class="nom-monde"></b> <i>no tiene documentos relacionados</i>.</p>
        <p id="bouton-mondes-noaction" class="boutons">Confirmar</p>
    </div>
</div>
