<?php
session_start();
?>
<!--LOCALISATION-->
<div id="designer">
    <ul id="container-map"></ul>
    <div id="container-action">
        <div class="action help" id="help-0">
            <h1>Elige un tipo de documento</h1>
            <p>Para empezar la creacion de tu mundo, tienes que identificar el tipo de documento que quieres clasificar.</p>
            <p><input type="text" id="champ-type" placeholder="Factura, Nomina, Cotizacion, Comprobante..."></p>
        </div>
        <div class="action help" id="help-1">
            <h1>Clasificacion de <b class="tuto-monde"></b></h1>
            <p>Segun cual criterio se clasifica un <b class="tuto-monde"></b>?</p>
            <p>Por ejemplo, hemos visto un <b class="tuto-monde"></b> clasificado : </p>
            <p><ul class="suggest-champs"></ul></p>
            <p><input type="text" id="champ-type" placeholder="Proyecto, Cliente, Segmento ..."></p>
        </div>
    </div>
</div>
