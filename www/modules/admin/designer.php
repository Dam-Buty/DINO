<?php
session_start();
?>
<!--LOCALISATION-->
<div id="designer" class="admin">
    <div class="boutons" id="bouton-save-monde">Guardar</div>
    <h1>Creacion del mundo <input type="text" id="nom-monde" placeholder="Nuevo mundo..."/></h1>
    <div id="container-map">
        <h1>Perfil documental</h1>
        <ul id="liste-map">
        </ul>
        <div class="boutons bouton-designer" id="bouton-new-champ">Agregar un campo</div>
    </div>
    <div id="container-action">
        <div class="action" id="action-champ">
            <h1>Nuevo campo</h1>
            <p><input type="text" id="label-new-champ" placeholder="Nombre del campo"/>&nbsp;<i>(por ejemplo <b>Cliente</b>, <b>Proyecto</b>, <b>Producto</b>...)</i></p>
            <p><input type="text" id="pluriel-new-champ" placeholder="Pluriel del campo"/>&nbsp;<i>(<b>Clientes</b>, <b>Proyectos</b>, <b>Productos</b>...)</i></p>
            <div class="boutons bouton-designer" id="bouton-save-champ">Guardar</div>
        </div>
        <div class="action" id="action-type">
            <h1>Nuevo tipo de documento</h1>
            <p><input type="text" id="label-new-type" placeholder="Tipo de documento"/>&nbsp;<i>(por ejemplo <b>Contrato</b>, <b>Factura</b>, <b>Comprobante</b>...)</i></p>
            <p><input type="checkbox" id="detail-new-type"/>&nbsp;Se puede agregar un detalle a este tipo de documento (por ejemplo "Comprobante <b>hotel</b>" o "Contrato <b>firmado</b>")</p>
            <p><input type="checkbox" id="time-new-type"/>&nbsp;Este documento es mensual</p>
            <p>Este documento es visible a partir del nivel :
                <select id="designer-type-niveau" class="select-new-niveau" data-placeholder="Nivel de usuario...">
                    <option value=""></option>
                    <option value="0">Visitor</option>
                    <option value="10">Archivista</option>
    <?php if ($_SESSION["niveau"] >= 30) { ?>
                    <option value="20">Administrador</option>
    <?php } ?>
                </select>
            </p>
            <div class="boutons bouton-designer" id="bouton-save-type">Guardar</div>
        </div>
        <div class="action" id="action-categorie">
            <h1>Nueva categoria</h1>
            <p><input type="text" id="label-new-categorie" placeholder="Categoria"/>&nbsp;<i>(por ejemplo <b>Contable</b>, <b>Operacional</b>, <b>Fiscal</b>...)</i></p>
            <p><input type="checkbox" id="time-new-categorie"/>&nbsp;Esta categoria contiene documentos <b>mensuales</b></p>
            <p>Esta categoria es visible a partir del nivel :
                <select id="designer-categorie-niveau" class="select-new-niveau" data-placeholder="Nivel de usuario...">
                    <option value=""></option>
                    <option value="0">Visitor</option>
                    <option value="10">Archivista</option>
    <?php if ($_SESSION["niveau"] >= 30) { ?>
                    <option value="20">Administrador</option>
    <?php } ?>
                </select>
            </p>
            <div class="boutons bouton-designer" id="bouton-save-categorie">Guardar</div>
        </div>
    </div>
    <div id="container-help">
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
