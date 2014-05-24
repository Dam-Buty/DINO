<?php
session_start();
?>
<div id="core" class="principal">
    <div id="container-tips">
        <div id="tip-upload" class="tip">
            <h1>Carga tus facturas en DINO</h1>
            <p>Felicidades! Tu cuenta <b>DINO</b> esta lista para usarse.</p>
            <p>Vamos a organizar juntos tus primeres documentos, empezando con un gran clasico : tus <b>facturas</b>.</p>
            <p>Da click en "<b>Archivos</b>" o "<b>Carpeta</b>" para cargar tus <b>facturas</b> desde tu disco duro.</p>
        </div>

        <div id="tip-store" class="tip">
            <h1>Organiza tus facturas</h1>
            <p>Muy bien! Puedes ver que <b>DINO</b> empezo a trabajar con tus documentos, clasificandolos por tipo de archivo.</p>
            <p>Ahora vamos a <b>clasificar</b> tus <b>facturas</b>, atribuyendolas a sus clientes respectivos.</p>
            <p>Da click en uno de tus documentos para empezar a clasificarlo.</p>
        </div>

        <div id="tip-watch" class="tip">
            <h1>Felicidades</h1>
            <p>Acabas de cargar y clasificar tu primer <b>Documento</b>.</p>
            <p>La proxima vez que lo necesitas, lo encontraras en el mundo <b class="tip-champ-monde"></b>, adentro del <b class="tip-champ-entite"></b> <b class="tip-champ-entite-nom"></b>.</p>
        </div>
    </div>
    <div id="liste" class="front-element">
    </div>
</div>

<script type="text/javascript">
    
    $("#search").change(function(evt, params) {
        Core.recherche.length = 0;
        $.each(evt.currentTarget.selectedOptions, function(i, option) {
            var sel = $(option);
            Core.recherche.push({ champ: sel.attr("data-champ"), valeur: sel.attr("data-pk") });
        })
        charge_documents();
    });
    
    bootstrap_list();
    
</script>
