<div id="popup-store" data-document="">
    <ul id="list-champs"></ul>
    <div id="container-nav">
        <div id="prev-store" class="nav-store"></div>
        <img id="del-doc-store" src="img/trash_15.png" title="Borrar documento"/>
        <div id="next-store" class="nav-store"></div>
    </div>
    <div id="nom-doc-store"></div>
    <iframe id="viewer-store"></iframe>
    <ul id="mondes-store" class="list-mondes"></ul>
    <div id="container-store">
        <div id="container-nouveau-champ">
        </div>
        <div id="container-classification">
            <div class="entete-store" id="entete-classification"></div>
            <ul class="classif" id="list-classification"></ul>
            <div class="entete-store" id="entete-time"></div>
            <ul class="classif" id="list-time"></ul>
        </div>
        <div id="container-details">
            <div class="ligne-details" id="container-date">
                <div class="cell-details">
                    Fecha del documento : 
                </div>
                <div class="cell-details">
                    <input type="text" id="date-store"/>
                </div>
            </div>
            <div class="ligne-details" id="container-detail">
                <div class="cell-details">
                    Comentario : 
                </div>
                <div class="cell-details">
                    <input type="text" id="detail-store"/>
                </div>
            </div>
            <div class="boutons" id="bouton-store">Archivar en DINO</div>
        </div>
        <div id="container-tips-alt" class="tip">
            <div id="tip-nofacture" class="tips-store">
                <p>Si tu documento es una <b>Factura</b>, deberia pertenecer a tus <b>Ventas</b> o tus <b>Compras</b>.</p>
                <p>Puedes seguir clasificando un documento relacionado con tus <b>Empleados</b>, pero sera sin tutorial.</p>
            </div>
        </div>
        <div id="container-tips-store" class="tip">
            <div id="tip-monde" class="tips-store">
                <p>Clasificar tus documentos es <b>muy simple</b>.</p>
                <p>Si es una <b>Factura</b>, deberia pertenecer a tus <b>Ventas</b> o tus <b>Compras</b>.</p>
                <p>Da click en el <b>Mundo</b> adecuado.</p>
            </div>
            <div id="tip-entite" class="tips-store">
                <p>Ahora sabemos que tu <b>Factura</b> pertenece al mundo <b class="tip-champ-monde"></b>.</p>
                <p>Una <b>Factura</b> corresponde a un <b class="tip-champ-entite"></b> y a una <b class="tip-champ-event"></b>.</p>
                <p>Crea tu primer <b class="tip-champ-entite"></b> para attribuirle a tu <b>Factura</b>.</p>
            </div>
            <div id="tip-event" class="tips-store">
                <p>OK, entonces es una <b>Factura</b> del <b class="tip-champ-entite"></b> <b class="tip-champ-entite-nom"></b>.</p>
                <p>Ahora, crea tu primera <b class="tip-champ-event"></b>.</p>
            </div>
            <div id="tip-type" class="tips-store">
                <p>Muy bien!</p>
                <p>Dependiendo del tipo de <b class="tip-champ-event"></b>, puede ser :</p>
                <p>- Una <b>Factura unica</b></p>
                <p>- O una <b>Factura recurrente</b> (por ejemplo <b>mensual</b>). En este caso, va a requerir una <b>Fecha</b> para organizarse correctamente.</p>
            </div>
        </div>
    </div>
</div>
