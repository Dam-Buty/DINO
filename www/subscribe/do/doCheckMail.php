<?php
include("../../includes/log.php");
include("../../includes/mysqli_prod.php");

$query = "SELECT `pk_client`, `nb_op_client`, `entreprise_client`, `nom_contact`, `tel_client`, `ext_contact`, `mail_client` FROM `client` WHERE `mail_client` = '" . $_POST["mail"] . "';";

if ($result = $mysqli->query($query)) {
 if ($row = $result->fetch_assoc()) {
    $json = '{ "returning": 1, "pk": "' . $row["pk_client"] . '", "op": "' . $row["nb_op_client"] . '", "entreprise": "' . $row["entreprise_client"] . '", "nom": "' . $row["nom_contact"] . '", "tel": "' . $row["tel_client"] . '", "ext": "' . $row["ext_contact"] . '", "mail": "' . $row["mail_client"] . '" }';
 } else {
    $json = '{ "returning": 0 }';
 }
} else {
    $json = '{ "returning": 0 }';
}

header('Content-Type: application/json');
echo $json;   
?>
