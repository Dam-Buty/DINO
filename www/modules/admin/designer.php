<?php
session_start();
?>
<!--LOCALISATION-->
<div id="designer" class="admin">
    <div class="boutons save-monde-KO" id="bouton-save-monde">Guardar</div>
    <div class="boutons" id="bouton-clear-monde">Borrar todo</div>
    <h1><span>Creacion del mundo </span><input type="text" id="nom-monde" placeholder="Nuevo mundo..."/></h1>
    <div id="container-map">
        <h2 class="designer-header">Perfil documental<span class="designer-add-champ" title="Agregar un campo"></span></h2>
        <ul id="liste-map">
        </ul>
    </div>
    <div id="container-action" class="designer-right">
        <div class="action" id="action-welcome">
            <h2 class="designer-header">Editar un mundo</h2>
            <p>Bienvenido en el editor de mundos documentales <b>DINO</b>.</p>
            <p> En la parte de izquierda se encuentra tu mundo actual.</p>
            <p>Puedes agregar o modificar campos, categorias y tipos de documentos para adaptarlos a tus necesidades.</p>
        </div>
        <div class="action" id="action-champ">
            <h2 class="designer-header">Nuevo campo</h2>
            <p>
                <label>Nombre : <input type="text" id="label-new-champ" placeholder="'Cliente', 'Proyecto', 'Producto'"/></label>
            </p>
            <div class="boutons bouton-designer" id="bouton-save-champ"></div>
        </div>
        <div class="action" id="action-post-champ">
            <h2 class="designer-header">Campo <b class="option-help-champ"></b></h2>
            <p></p>
            <div class="designer-option option-help" id="add-doc-to-champ">
                <h1>Documento</h1>
                <p>Agregar un tipo de documento al campo <b class="option-help-champ"></b></p>
            </div>
            <div class="designer-option option-help" id="add-champ">
                <h1>Campo</h1>
                <p>Agregar un <b>nuevo Campo</b></p>
            </div>
            <div style="clear: right;"></div>
        </div>
        <div class="action" id="action-type">
            <h2 class="designer-header">Nuevo tipo de documento</h2>
            <p>
                <label>Nombre : <input type="text" id="label-new-type" placeholder="Contrato, Factura, Comprobante..."/></label>
            </p>
            <h3>Seguridad</h3>
            <p>
                Este documento es visible a partir del nivel :<br/>
                <select id="designer-type-niveau" class="select-new-niveau" data-placeholder="Nivel de usuario...">
                    <option value="0">Visitante</option>
                    <option value="10">Archivista</option>
    <?php if ($_SESSION["niveau"] >= 20) { ?>
                    <option value="20">Administrador</option>
    <?php } ?>
    <?php if ($_SESSION["niveau"] >= 30) { ?>
                    <option value="30">Gerente</option>
    <?php } ?>
                </select>
                <i style="display: block;">Aqui decides <a href="http://www.dino.mx/university/los-diferentes-niveles-de-usuarios-dino/" target="_blank">quien puede acceder a tu documento</a>.</i>
            </p>
            <h3>Opciones</h3>
            <p>
                <input type="checkbox" id="detail-new-type">
                <input type="checkbox" id="time-new-type"/>
                <div style="clear: right;"></div>
            </p>
            <div class="boutons bouton-designer" id="bouton-save-type"></div>
        </div>
        <div class="action" id="action-categorie">
            <h2 class="designer-header">Nueva categoria</h2>
            <p>
                <label>Nombre : <input type="text" id="label-new-categorie" placeholder="Contable, Operacional, Fiscal"/></label>
            </p>
            <h3>Seguridad</h3>
            <p>Esta categoria es visible a partir del nivel :
                <select id="designer-categorie-niveau" class="select-new-niveau" data-placeholder="Nivel de usuario...">
                    <option value="0">Visitante</option>
                    <option value="10">Archivista</option>
    <?php if ($_SESSION["niveau"] >= 20) { ?>
                    <option value="20">Administrador</option>
    <?php } ?>
    <?php if ($_SESSION["niveau"] >= 30) { ?>
                    <option value="30">Gerente</option>
    <?php } ?>
                </select>
                <i>Aqui decides <a href="http://www.dino.mx">quien puede acceder a tu categoria</a>.</i>
            </p>
            <div class="boutons bouton-designer" id="bouton-save-categorie"></div>
        </div>
        <div class="action" id="action-post-categorie">
            <h2 class="designer-header">Categoria <b class="option-help-categorie"></b></h2>
            <p></p>
            <div class="designer-option option-help" id="add-doc-to-cat">
                <h1>Documento</h1>
                <p>Agregar un tipo de documento a la categoria <b class="option-help-categorie"></b></p>
            </div>
            <div class="designer-option option-help" id="add-champ-cat">
                <h1>Campo</h1>
                <p>Agregar un <b>nuevo Campo</b></p>
            </div>
            <div style="clear: right;"></div>
        </div>
    </div>
    <div id="container-templates" class="designer-right">
        <h2 class="designer-header">Creacion de mundo</h2>
        <p id="pre-templates">Puedes utilizar uno de nuestros mundos pre-configurados ...</p>
        <select id="list-templates" class="select-templates" data-placeholder="Seleccione una plantilla">
        </select>
        <p id="pre-description">Puedes <b>modificar tu mundo</b> o dar click en <b>PUBLICAR</b> si te conviene.</p>
        <div id="container-description" class="dialog-box">
        </div>
    </div>
    <div id="container-ou-champ" class="designer-right">
        <p>... o crear tu mundo a partir del primer campo</p>
        <div class="designer-option option-help" id="add-champ-template">
            <h1>Campo</h1>
            <p>Agregar un <b>nuevo Campo</b></p>
        </div>
        <div style="clear: right;"></div>
    </div>
    <div id="container-help" class="designer-right">Si tienes alguna duda, te invitamos a consultar<br/><a href="http://prezi.com/i1z9x8l-77l7/" target="_blank">3 ejemplos de mundos documentales</a> o <a href="http://prezi.com/7rblvsge3xfs/" target="_blank">8 tips para un perfil perfecto</a></div>
</div>
