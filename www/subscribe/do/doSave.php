<?php

include("../../includes/mysqli_prod.php");

switch ($_POST["page"]) {
    
    case 1:
        $query = "INSERT INTO `client` (`mail_client`, `tel_client`, `ext_contact`) VALUES ('" . $_POST["mail"] . "', '" . $_POST["tel"] . "', '" . $_POST["ext"] . "');";
        break;
    
    case 2:
        $query = "UPDATE `client` SET `nom_contact` = '" . $_POST["nom"] . "', `entreprise_client` = '" . $_POST["entreprise"] . "', `poste_contact` = '" . $_POST["poste"] . "' WHERE `pk_client` = '" . $_POST["pk"] . "';";
        break;
        
    case 3:
        $query = "UPDATE `client` SET `nb_emp_client` = '" . $_POST["nb_emp"] . "', `nb_op_client` = '" . $_POST["nb_op"] . "', `nb_douanes_client` = '" . $_POST["nb_douanes"] . "' WHERE `pk_client` = '" . $_POST["pk"] . "';";
        break;
        
    case 4:
        $query = "UPDATE `client` SET `mail_client` = '" . $_POST["mail"] . "', `tel_client` = '" . $_POST["tel"] . "', `ext_contact` = '" . $_POST["ext"] . "', `nom_contact` = '" . $_POST["nom"] . "', `entreprise_client` = '" . $_POST["entreprise"] . "', `call_me_maybe` = 1 WHERE `pk_client` = '" . $_POST["pk"] . "';";
        break;
}

if ($result = $mysqli->multi_query($query)) {
    $json = '{"query": "' . $query . '", "status": "saved", "pk": "' . $mysqli->insert_id . '" }';
} else {
    $json = '{"status": "error", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
}
header('Content-Type: application/json');
echo $json;   
?>

