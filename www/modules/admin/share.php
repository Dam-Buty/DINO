<ul>
    <li class="liste user">
        <img class="user-edit" src="img/edit.png"/>
        <img class="user-key" src="img/key.png"/>
        <img class="user-del" src="img/del.png"/>
        <div class="label-liste">
            <h1>test.dami <i>(dam.buty@gmail.com)</i></h1>
            <p>Un archivista con acceso a los mundos <b>Operativo</b> y <b>Provedores</b></p>
        </div>
        <div class="edit edit-user">
            <input type="text" class="edit-mail"/>
            <select class="edit-niveau" data-placeholder="Nivel de usuario...">
                <option value=""></option>
                <option value="0">Visitor</option>
                <option value="10">Archivista</option>
                <option value="20">Administrador</option>
            </select>
        </div>
    </li>
    <li class="liste user">
        <img class="user-edit" src="img/edit.png"/>
        <img class="user-key" src="img/key.png"/>
        <img class="user-del" src="img/del.png"/>
        <div class="label-liste">
            <h1>test.dami <i>(dam.buty@gmail.com)</i></h1>
            <p>Un archivista con acceso a los mundos <b>Operativo</b> y <b>Provedores</b></p>
        </div>
    </li>
</ul>

<script type="text/javascript">
    $(".edit-niveau").chosen({
        inherit_select_classes: true,
        disable_search_threshold: 10
    });
</script>
