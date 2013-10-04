var logOut = function() {
        
};

var archive = function() {
    
};

var anime_queue = function() {
    if ($("#container-queue").attr("data-state") == "closed") {
        $("#tiroir-queue").animate({ left: 0 });
        $("#poignee-queue").animate({ left: "30%" });
        $("#container-queue").attr({ "data-state": "open" });
    } else {
        $("#tiroir-queue").animate({ left: "-30%" });
        $("#poignee-queue").animate({ left: "0" });
        $("#container-queue").attr({ "data-state": "closed" });
    }
}

var anime_search = function() {
    if ($("#container-search").attr("data-state") == "closed") {
        $("#tiroir-search").animate({ top: 0 });
        $("#poignee-search").animate({ top: "30%" });
        $("#container-search").attr({ "data-state": "open" });
    } else {
        $("#tiroir-search").animate({ top: "-30%" });
        $("#poignee-search").animate({ top: "0" });
        $("#container-search").attr({ "data-state": "closed" });
    }
}

var admin_users = function() {    
    //////////////////
    // D'abord on definit les différentes fonctions
    
    var dialog_user = function(event) {
        
        var isNew = 1;
        var row = undefined;
        var login = "";
        var mail = "";
        var type = "";
        var detail = "";
        var htmlForm = '<form id="form_edition"><table class="table_edition">';
        var htmlLogin = "";
        var htmlTypes = "";
        var htmlClients = "";
        var htmlDouanes = "";
        var titreDialogue = "";
        
        // Si on est en modification on récupère les infos 
        if (typeof event !== 'number') {
            isNew = 0;
            row = $(this).parent().parent();
            console.log($(row).find("td").eq(0));
            login = $(row).find("td").eq(0).text();
            mail = $(row).find("td").eq(1).text();
            type = $(row).find("td").eq(2).attr("data-value");
            detail = $(row).find("td").eq(3).attr("data-value");
        }
        
        htmlForm += '<input type="hidden" id="pk" value="' + login + '"/>';
        
        if (isNew) {
            htmlLogin += '<tr><td>Nombre de usuario : </td><td><input type="text" id="value_login" value="' + login + '" class="validate[required]"/></td></tr>';
            titreDialogue = "Creacion de un usuario";
        } else {
            htmlLogin += '<tr><td>Nombre de usuario : </td><td><div id="value_login"><b>' + login + '</b><div></td></tr>';
            titreDialogue = "Modificacion del usuario " + login;
        }
        
        $(types).each( function() {
            htmlTypes += '<option value="' + this.value + '">' + this.text + '</option>';
        });
        
        $(interlocuteurs).each( function() {
            htmlClients += '<option value="' + this.pk + '">' + this.nom + '</option>';
        });
        
        var firstKO = 1;
        htmlDouanes += '<optgroup label="Aduanas activas">'
        $(douanes).each( function() {
            if (this.OK == "0" && firstKO) {
                htmlDouanes += '<optgroup label="Aduanas inactivas">'
                firstKO = 0;
            }
            htmlDouanes += '<option value="' + this.code + '">' + this.nom + '</option>';
        });
        
        htmlForm += '<input type="hidden" id="isNew" value="' + isNew + '"/>';
        htmlForm += htmlLogin;
        htmlForm += '<tr><td>Correo electronico : </td><td><input type="text" id="value_mail" class="validate[required,custom[email]]" value="' + mail + '"></td></tr>';
        htmlForm += '<tr><td>Tipo de usuario : </td><td><select id="value_type" data-placeholder="Tipo de usuario" class="validate[required]">';
        htmlForm += htmlTypes;
        htmlForm += '</select></td></tr>';
        htmlForm += '<tr><td>Detalles : </td><td><span id="span_value_client" style="display: none"><select id="value_client" data-placeholder="Elige un cliente" class="validate[required]">';
        htmlForm += htmlClients;
        htmlForm += '</select></span>';
        htmlForm += '<span id="span_value_douane" style="display: none"><select id="value_douane" data-placeholder="Elige unas aduanas" multiple="multiple">';
        htmlForm += htmlDouanes;
        htmlForm += '</select></span></td></tr>';
        htmlForm += '</table></form>';
        
        new $.Zebra_Dialog(htmlForm, {
            'type': false,
            'title': titreDialogue, 
            'position': ['top + 100'],
            'buttons':  [{
                caption: 'Borrar usuario',
                callback: del_user
            }, {
                caption: 'Cancelar',
                callback: function() {}
            }, {
                caption: 'OK', 
                callback: save_user
            } ]
        });

        $("#value_type").val(type);

        $("#value_type").chosen({ disable_search: true }).change( function() {
            if (this.value == 0) {
                $('#span_value_douane').hide();
                $('#span_value_client').show("slow");
            } else if (this.value == 1) {            
                $('#span_value_client').hide();
                $('#span_value_douane').show("slow");
            } else {
                $('#span_value_douane').hide();
                $('#span_value_client').hide();
            }
        });
        
        if (type == 0) {
            $("#value_client").val(detail);
            $("#value_client").chosen({width: "80%" });
            $("#value_douane").chosen({width: "80%" });
            $('#span_value_client').show();
        } else if (type == 1) {
            detail = detail.split(", ");
            $("#value_douane").val(detail);
            $("#value_client").chosen({width: "80%" });
            $("#value_douane").chosen({width: "80%" });
            $('#span_value_douane').show();
        }
        
        $('#form_edition').validationEngine('attach', {focusFirstField : false, prettySelect: true, useSuffix: '_chosen', autoPositionUpdate: true});
    }
    
    // Fonction exécutée quand l'user clique sur "sauvegarder"
    var save_user = function() {
        if ($('#form_edition').validationEngine('validate')) {
            var pk = "";
            
            if ($("#isNew").val() == "1") {
                pk = $("#value_login").val();
            } else {
                pk = $("#pk").val();
            }
            
            $.ajax({
                url: "do/doUserSave.php",
                type: "POST",
                data: {
                    isNew: $("#isNew").val(),
                    login: pk,
                    mail: $("#value_mail").val(),
                    type: $("#value_type").val(),
                    client: $("#value_client").val(),
                    douanes: $("#value_douane").val()
                }
            }).done(function ( data ) {
                if (data.status == "saved") {
                    new $.Zebra_Dialog(
                        'El usuario ' + data.login + ' ha sido modificado con exito.', {
                        'type': 'information',
                        'buttons':  false,
                        'modal': false,
                        'width': Math.floor($(window).width() * 0.3),
                        'position': ['right - 20', 'top + 20'],
                        'auto_close': 3000
                    });
                } else {
                    new $.Zebra_Dialog(
                        'El usuario ' + data.login + ' no pudo ser modificado. Gracias por intentar otra vez', {
                        'type': 'error',
                        'buttons':  false,
                        'modal': false,
                        'width': Math.floor($(window).width() * 0.3),
                        'position': ['right - 20', 'top + 20'],
                        'auto_close': 3000
                    });
                }
            });
            return true;
        } else {
            new $.Zebra_Dialog(
                'Gracias por entrar todas las informaciones requiridas.', {
                'type': 'error',
                'buttons':  false,
                'modal': false,
                'width': Math.floor($(window).width() * 0.3),
                'position': ['right - 20', 'top + 20'],
                'auto_close': 3000
            });
            return false;
        }
    }

    // Fonction utilisée quand l'user clique sur "reset"
    var reset_user = function() {
        $.ajax({
            url: "do/doUserResetPass.php",
            type: "POST",
            data: {
                login: $(".edition").attr("id")
            }
        }).done(function ( data ) {
        
        });
    }

    // Fonction utilisée quand l'user clique sur "delete"
    var del_user = function() {
        $.ajax({
            url: "do/doUserDel.php",
            type: "POST",
            data: {
                login: $(".edition").attr("id")
            }
        }).done(function ( data ) {
            if (data.status == "deleted") {
                new $.Zebra_Dialog(
                    'El usuario ' + data.login + ' ha sido supprimido con exito.', {
                    'type': 'information',
                    'buttons':  false,
                    'modal': false,
                    'width': Math.floor($(window).width() * 0.3),
                    'position': ['right - 20', 'top + 20'],
                    'auto_close': 3000
                });
                $(".edition").remove();
                $(".editing").remove();
            } else {
                new $.Zebra_Dialog(
                    'El usuario ' + data.login + ' no pudo ser supprimido.', {
                    'type': 'error',
                    'buttons':  false,
                    'modal': false,
                    'width': Math.floor($(window).width() * 0.3),
                    'position': ['right - 20', 'top + 20'],
                    'auto_close': 3000
                });
                $(".edition").remove();
                $(".editing").remove();
            }
        });
        $('#table_users').trigger('tableUpdated');
    }
    
    ////////////////
    // Ensuite on crée le dialogue
    
    // Préparation des variables pour les plugins
    var _height = $(window).height();
    var _width = $(window).width();
    var _head = ['Nombre','Email','Tipo', 'Detalles', 'Accion'];// Goes on the <thead>
    var _json = ['user', 'mail', 'type', 'detail', 'action'];//json identities from the loaded json object
    
    // on vide le content
    $("#content").empty();
    
    $("<table></table>").attr({ id: "table_users", class: "table-sort table-sort-search table-sort-show-search-count table-sort-show-button" }).appendTo($("#content"));
    $("<thead></thead>").appendTo($("#table_users"));
    $("<tbody></tbody>").appendTo($("#table_users"));
    
    // On cree la jsonTable à vide
    $("#table_users").jsonTable({
        head : _head, 
        json : _json,
        id: "user"
    });
    
    var options = {
        source : "json/users.php", // Can be a URL or a JSON object array
        rowClass : "ligne_user", //(optional) Class to be applied
        callback : function() {
            // On fixe les tailles de colonnes
            $('#table_users thead').find('th').eq(0).css({ width: '15%' }).attr({ class: "table-sort" });
            $('#table_users thead').find('th').eq(1).css({ width: '30%' }).attr({ class: "table-sort" });
            $('#table_users thead').find('th').eq(2).css({ width: '15%' }).attr({ class: "table-sort" });
            $('#table_users thead').find('th').eq(3).css({ width: '25%' });
            $('#table_users thead').find('th').eq(4).css({ width: '15%' });
            
            $('#table_users tr').each( function () {
                $(this).find('td').eq(0).css({ width: '15%' });
                $(this).find('td').eq(1).css({ width: '30%' });
                $(this).find('td').eq(2).css({ width: '15%' });
                $(this).find('td').eq(3).css({ width: '25%' }).addClass("details");
                $(this).find('td').eq(4).css({ width: '15%' });
            });
            
            // On chrome la table
            $('table.table-sort').tablesort();
            
            // On ajoute les boutons dans les lignes
            $("#table_users tr th:nth-child(5)")
                .css({ "text-align": "right", "padding-right": "7px"});
                
            $("#table_users tr td:nth-child(5)")
                .css({ "text-align": "right", "padding-right": "7px"})
                .append($("<a></a>").attr({ class: "boutons" })
                    .html("<img src='img/edit.png' title='Modificar el usuario'/>&nbsp;")
                    .click(dialog_user)
                 )
                .append($("<a></a>").attr({ class: "boutons" })
                    .html("<img src='img/key.png' title='Reiniciar la contraseña'/>&nbsp;")
                    .click(reset_user)
                )
                .append($("<a></a>").attr({ class: "boutons" })
                    .html("<img src='img/del.png' title='Borrar el usuario'/>")
                    .click(del_user)
                );
            
            $(".table-sort-search-new").click( function() {
                dialog_user(1);
            });
        }
    };
    
    // On remplit la jsonTable avec la liste des users
    $("#table_users").jsonTableUpdate(options);
    
    
//    // On cree le dialogue
//    new $.Zebra_Dialog("<form id='form_edition'><table id='table_users'><thead></thead><tbody></tbody></table></form>", {
//        'type': false,
//        'max_height': _height,
//        'width': _width,
//        'title': 'Gestion de los usuarios', 
//        'buttons':  [{
//            caption: 'OK', 
//            callback: function() { 
//                $(".edition").hide('fast', function(){ $(".edition").remove(); });
//        }}]
//    });
    
    

    
//    $("<table></table>").attr({ id: "temp_edit" }).hide().appendTo($(document.body));
//    
//    // On crée la ligne d'édition qui est cachée pour l'instant
//    $("<tr></tr>").attr({ class: "ligne_edit", id: "ligne_champs"}).appendTo($("#temp_edit"));
//    
//    // // // // //
//    // Cellule login        
//    $("<td></td>").attr({ id: 'login' }).appendTo($("#ligne_champs"));

//    // // // // //
//    // Cellule mail        
//    $("<td></td>").attr({ id: 'mail' }).appendTo($("#ligne_champs"));
//    $("<input/>").attr({ type: 'text', id: 'value_mail', "class": "validate[required,custom[email]]" }).css({ width: "95%" }).appendTo($("#mail"));

//    // // // // //
//    // Cellule type
//    $("<td></td>").attr({ id: 'type' }).appendTo($("#ligne_champs"));
//    $("<select></select>").attr({ id: 'value_type'}).appendTo($("#type"));
//        
//    $(types).each(function() {
//        $("#value_type").append($("<option>").attr({ value: this.value }).text(this.text));
//    });
//        
//    $("#value_type").chosen({
//        disable_search: true,
//        width: "100%"
//    }).change( function() {
//        if (this.value == 0) {
//            $('#span_value_douane').hide();
//            $('#span_value_client').show("slow");
//        } else if (this.value == 1) {            
//            $('#span_value_client').hide();
//            $('#span_value_douane').show("slow");
//        } else {
//            $('#span_value_douane').hide();
//            $('#span_value_client').hide();
//        }
//    });

//    // // // // //
//    // Cellule details
//    $("<td></td>").attr({ id: 'details' }).appendTo($("#ligne_champs"));
//    
//    // Select Clients
//    $("<span></span>").attr({ id: 'span_value_client' }).hide().appendTo($("#details"));
//    $("<select></select>").attr({ id: 'value_client', "data-placeholder": "Elige un cliente" }).appendTo($('#span_value_client'));
//    $.each(interlocuteurs, function() {
//        $("#value_client").append($("<option>").attr({ value: this.num }).text(this.nom));
//    });

//    $("#value_client").chosen({
//        width: "100%"
//    });

//    // Select Douanes
//    $("<span></span>").attr({ id: 'span_value_douane' }).hide().appendTo($("#details"));
//    $("<select></select>").attr({ id: 'value_douane', multiple: "multiple", "data-placeholder": "Elige unas aduanas" }).appendTo($('#span_value_douane'));

//    var leGroupe = $("<optgroup label='Aduanas activas'>").appendTo($("#value_douane"));

//    var firstKO = 1;

//    $.each(douanes, function() {
//        if (this.OK == "0" && firstKO) {
//            leGroupe = $("<optgroup label='Aduanas inactivas'>").appendTo($("#value_douane"));
//            firstKO = 0;
//        }
//        
//        leGroupe.append($("<option>").attr({ value: this.code }).text(this.nom));
//    });

//    $("#value_douane").chosen({
//        width: "100%"
//    });
//    
//    // création de la ligne avec les boutons
//    $("<tr></tr>").attr({ class: "ligne_edit", id: "ligne_boutons" }).appendTo($("#temp_edit"));
//    $("<td></td").attr({ colspan: "4", id: "boutons" }).css({ "text-align": "center" }).appendTo($("#ligne_boutons"));
//    
//    // On affiche les boutons
//    $("<a></a>").attr({ class: "boutons" }).html("<img src='img/save.png'/>&nbsp;Guardar").click(save_user).appendTo("#boutons");
//    $("#boutons").append("&nbsp;");
//    $("<a></a>").attr({ class: "boutons" }).html("<img src='img/pass.png'/>&nbsp;Reiniciar contraseña").click(reset_user).appendTo("#boutons");
//    $("#boutons").append("&nbsp;");
//    $("<a></a>").attr({ class: "boutons" }).html("<img src='img/del.png'/>&nbsp;Supprimir").click(del_user).appendTo("#boutons");
//    $("#boutons").append("&nbsp;");
//    $("<a></a>").attr({ class: "boutons" }).html("<img src='img/cancel.png'/>&nbsp;Cancelar").click(hide_edit).appendTo("#boutons");
//    
//    // On fixe les tailles de colonnes dans la table temp
//    $('#temp_edit tr').each( function () {
//        $(this).find('td').eq(0).css({ width: '15%' });
//        $(this).find('td').eq(1).css({ width: '30%' });
//        $(this).find('td').eq(2).css({ width: '15%' });
//        $(this).find('td').eq(3).css({ width: '40%' });
//    });
//    
//    // On affecte le Form au Validation Engine
//    $('#form_edition').validationEngine('attach', {focusFirstField : false});
};

var admin_clients = function() {
    new $.Zebra_Dialog('', {
        'source':  {'ajax': 'modules/admin/clients.php'},
        buttons: false,
        type: false,
        'title': 'Gestion de los clientes'
    });    
};

var modif_pass = function() {
    new $.Zebra_Dialog('', {
        'source':  {'ajax': 'modules/pass.php'},
        buttons: false,
        type: false,
        'title': 'Modificar su contrasenña'
    });    
};

var admin_douanes = function() {
    new $.Zebra_Dialog('', {
        'source':  {'ajax': 'modules/admin/douanes.php'},
        buttons: false,
        type: false,
        'title': 'Gestion de las aduanas activas'
    });        
};

var admin_credits = function() {
    new $.Zebra_Dialog('', {
        'source':  {'ajax': 'modules/admin/credits.php'},
        buttons: false,
        type: false,
        'title': 'Sus creditos'
    });    
};
