<?php
session_start();
?>
<!--LOCALISATION-->
<div id="designer" class="admin">
    <div class="boutons" id="bouton-save-monde">Guardar</div>
    <h1>Creacion del mundo <input type="text" id="nom-monde" placeholder="Nuevo mundo..."/></h1>
    <div id="container-map">
        <h2>Perfil documental</h2>
        <ul id="liste-map">
        </ul>
        <div class="boutons bouton-designer" id="bouton-new-champ">Agregar un campo</div>
    </div>
    <div id="container-action">
        <div class="action" id="action-champ">
            <h2>Nuevo campo</h2>
            <p>
                <label>Nombre : <input type="text" id="label-new-champ" placeholder="Cliente, Proyecto, Producto"/></label>
            </p>
            <p>
                <label>Plural : <input type="text" id="pluriel-new-champ" placeholder="Clientes, Proyectos, Productos"/></label>
            </p>
            <div class="boutons bouton-designer" id="bouton-save-champ">Guardar</div>
        </div>
        <div class="action" id="action-post-champ">
            <h2>Campo <b class="option-help-champ"></b></h2>
            <p></p>
            <div class="designer-option option-help" id="add-doc-to-champ">
                <h1>Documento</h1>
                <p>Agregar un tipo de documento al campo <b class="option-help-champ"></b></p>
            </div>
            <div class="designer-option option-help" id="add-cat-to-champ">
                <h1>Categoria</h1>
                <p>Agregar una categoria de documentos al campo <b class="option-help-champ"></b></p>
            </div>
            <div style="clear: right;"></div>
        </div>
        <div class="action" id="action-type">
            <h2>Nuevo tipo de documento</h2>
            <p>
                <label>Nombre : <input type="text" id="label-new-type" placeholder="Contrato, Factura, Comprobante..."/></label>
            </p>
            <h3>Seguridad</h3>
            <p>
                Este documento es visible a partir del nivel :<br/>
                <select id="designer-type-niveau" class="select-new-niveau" data-placeholder="Nivel de usuario...">
                    <option value=""></option>
                    <option value="0">Visitor</option>
                    <option value="10">Archivista</option>
    <?php if ($_SESSION["niveau"] >= 30) { ?>
                    <option value="20">Administrador</option>
    <?php } ?>
                </select>
            </p>
            <h3>Opciones</h3>
            <p>
                <input type="checkbox" id="detail-new-type">
                <input type="checkbox" id="time-new-type"/>
                <div style="clear: right;"></div>
            </p>
            <div class="boutons bouton-designer" id="bouton-save-type">Guardar</div>
        </div>
        <div class="action" id="action-categorie">
            <h2>Nueva categoria</h2>
            <p>
                <label>Nombre : <input type="text" id="label-new-categorie" placeholder="Contable, Operacional, Fiscal"/></label>
            </p>
            <h3>Seguridad</h3>
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
        <div class="action" id="action-post-categorie">
            <h2>Categoria <b class="option-help-categorie"></b></h2>
            <p></p>
            <div class="designer-option option-help" id="add-cat-to-champ2">
                <h1>Categoria</h1>
                <p>Agregar otra categoria de documentos al campo <b class="option-help-champ"></b></p>
            </div>
            <div class="designer-option option-help" id="add-doc-to-cat">
                <h1>Documento</h1>
                <p>Agregar un tipo de documento a la categoria <b class="option-help-categorie"></b></p>
            </div>
            <div style="clear: right;"></div>
        </div>
    </div>
    <div id="container-help">
        <div class="action help" id="help-0">
            <h2>Elige un tipo de documento</h2>
            <p>Para empezar la creacion de tu mundo, tienes que identificar el tipo de documento que quieres clasificar.</p>
            <p><input type="text" id="champ-type" placeholder="Factura, Nomina, Cotizacion, Comprobante..."></p>
        </div>
        <div class="action help" id="help-1">
            <h2>Clasificacion de <b class="tuto-monde"></b></h2>
            <p>Segun cual criterio se clasifica un <b class="tuto-monde"></b>?</p>
            <p>Por ejemplo, hemos visto un <b class="tuto-monde"></b> clasificado : </p>
            <p><ul class="suggest-champs"></ul></p>
            <p><input type="text" id="champ-type" placeholder="Proyecto, Cliente, Segmento ..."></p>
        </div>
    </div>
</div>
