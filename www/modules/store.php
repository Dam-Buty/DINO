<div id="popup-store" data-document="">
    <ul id="list-champs"></ul>
    <div id="container-nav">
        <div id="prev-store" class="nav-store"></div>
        <img id="del-doc-store" src="img/trash_15.png" title="Borrar documento"/>
        <div id="next-store" class="nav-store"></div>
    </div>
    <div id="nom-doc-store"></div>
    <iframe id="viewer-store"></iframe>
    <div id="container-store">
        <div id="store-type" class="store-etape">
            <h1>Que tipo de documento es?</h1>
            <input type="text" id="search-type"  class="search-input" placeholder="Buscar o agregar un tipo de documento"/>
            <ul id="list-type" class="list-store">
                <li id="new-type" class="store-new"><div>Agregar el tipo "<b class="new-type-label"></b>"</div></li>
            </ul>
        </div>
        <div id="store-new-type" class="store-etape">
            <h1>A que se refiere un(a) "<b class="new-type-label"></b>"</h1>
        </div>
        <div id="store-champ" class="store-etape">
            <h1>A que se refiere tu "<b class="label-type"></b>"?</h1>
            <ul id="list-champ" class="list-store"></ul>
        </div>
        <div id="store-entite" class="store-etape">
            <h1>A que "<b class="label-entite"></b>" se refiere tu "<b class="label-type"></b>"</h1>
            <input type="text" id="search-entite" class="search-input"/>
            <ul id="list-entite" class="list-store">
                <li id="new-entite" class="store-new"><div>Agregar el/la <b class="label-entite"></b> "<b class="new-entite-label"></b>"</div></li>
            </ul>
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
