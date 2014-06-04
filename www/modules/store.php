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
                <li id="new-entite" class="store-new"><div>Agregar un(a) <b class="label-entite"></b> <b class="new-entite-label"></b></div></li>
            </ul>
        </div>
        <div id="store-detail" class="store-etape">
            <h1>Algun comentario sobre tu "<b class="label-type"></b>"?</h1>
            <input type="text" id="search-detail" class="search-input"/>
            <ul id="list-detail" class="list-store">
                <li id="new-detail" class="store-new"><div>Agregar Comentario</div></li>
            </ul>
        </div>
        <div id="store-time" class="store-etape">
        </div>
    </div>
</div>
