<?php
include("../includes/PDO.php");
?>
<select id="client">
<?php
    $query = "SELECT `pk_client`, `entreprise_client` FROM `client` ORDER BY `entreprise_client`;";
    
    if ($result = $mysqli->query($query)) {
        while($row = $result->fetch_assoc()) {
            echo "<option value='" . $row["pk_client"] . "'>" . $row["entreprise_client"] . "</option>";
        }
    }
?>
</select><br/><br/>
<input type="submit" value="Régénérer droits" id="regenerate"/>

<table id="mondes" data-selected="0">
    <thead>
        <tr><th colspan="5">Mondes</th></tr>
        <tr>
            <th>Sel.</th>
            <th>Label</th>
            <th>Niveau</th>
            <th>X</th>
        </tr>
    </thead>
    <tbody>
        <tr class="new_monde" data-monde="new">
            <td></td>
            <td><input type="text" class="label_monde"/></td>
            <td><input type="text" class="niveau_monde"/></td>
            <td><span class="save_monde">Save</span> - <span class="delete_monde">Delete</span></td>
        </tr>
    </tbody>
</table>
<br/>

<table id="champs" data-selected="0">
    <thead>
        <tr><th colspan="5">Champs</th></tr>
        <tr>
            <th>Sel.</th>
            <th>Label</th>
            <th>Pluriel</th>
            <th>X</th>
        </tr>
    </thead>
    <tbody>
        <tr class="new_champ" data-champ="new">
            <td></td>
            <td><input type="text" class="label_champ"/></td>
            <td><input type="text" class="pluriel_champ"/></td>
            <td><span class="save_champ">Save</span> - <span class="delete_champ">Delete</span></td>
        </tr>
    </tbody>
</table>
<br/>

<textarea id="liste_champ"></textarea>
<br><span class="save_liste">Save</span>
<br/><br/>

<table id="categories" data-selected="0">
    <thead>
        <tr><th colspan="4">Catégories</th></tr>
        <tr>    
            <th>Sel.</th>
            <th>Label</th>
            <th>Niveau</th>
            <th>X</th>
        </tr>
    </thead>
    <tbody>
        <tr class="new_categorie" data-categorie="new">
            <td></td>
            <td><input type="text" class="label_categorie"/></td>
            <td><input type="text" class="niveau_categorie"/></td>
            <td><span class="save_categorie">Save</span> - <span class="delete_categorie">Delete</span></td>
        </tr>
    </tbody>
</table>
<br/>

<table id="types" data-selected="0">
    <thead>
        <tr><th colspan="5">Types</th></tr>
        <tr>    
            <th>Label</th>
            <th>Détail</th>
            <th>Niveau</th>
            <th>X</th>
        </tr>
    </thead>
    <tbody>
        <tr class="new_type" data-type="new">
            <td><input type="text" class="label_type"/></td>
            <td><input type="checkbox" class="detail_type"/></td>
            <td><input type="text" class="niveau_type"/></td>
            <td><span class="save_type">Save</span> - <span class="delete_type">Delete</span></td>
        </tr>
    </tbody>
</table>

<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="js/superadmin.js"></script>
<script type="text/javascript">
charge_mondes();
$(".save_liste").click(save_liste);
$("#client").change(charge_mondes);
$("#regenerate").click(function() {
    var mondes = [];
    
    $.each($('tr[data-monde][data-monde!="new"]'), function(i, tr) {
        mondes.push($(tr).attr("data-monde"));
    });

    $.ajax({
        url: "do/doRegenerate.php",
        type: "POST",
        data: {
            client: $("#client").val(),
            mondes: mondes
        }
    });    
});
</script>
