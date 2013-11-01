<?php
session_start();
include("../includes/status.php");

if ($_SESSION["niveau"] > 10) {
    include("../includes/mysqli.php");
    
    if ($_POST["cyclique"] == 1) {
        if ($_POST["isnew"] == 1) {
            $query = "INSERT INTO `operation` (`pk_operation`, `date_operation`, `fk_monde`, `fk_client`, `fk_user`) VALUES ('" . $_POST["operation"] . "', '" . date("Y-m-d H:i:s") . "', " . $_POST["monde"] . ", " . $SESSION["client"] . ", '" . $_SESSION["user"] . "');";
            
            foreach($_POST["champs"] as $champ) {
                $query .= "INSERT INTO `operation_valeur_champ` (`fk_operation`, `fk_monde`, `fk_client`, `fk_valeur_champ`, `fk_champ`) VALUES (" . $_POST["operation"] . ", " . $_POST["monde"] . ", " . $_SESSION["client"] . ", " . $champ["valeur"] . ", " . $champ["pk"] . ");";
            }
        }
    } else {
        foreach($_POST["champs"] as $champ) {
            $query .= "INSERT INTO `document_valeur_champ` (`fk_document`, `fk_monde`, `fk_client`, `fk_valeur_champ`, `fk_champ`) VALUES (" . $_POST["filename"] . ", " . $_POST["monde"] . ", " . $_SESSION["client"] . ", " . $champ["valeur"] . ", " . $champ["pk"] . ");";
        }
    }
    
    $query .= "UPDATE `document` SET `date_document` = '" . date("Y-m-d H:i:s") . "', `niveau_document` = 0, `fk_operation` = '" . $_POST["operation"] . "';";
    
    $query .= "INSERT INTO `type_doc_document` (`fk_type_doc`, `fk_categorie_doc`, `fk_monde`, `fk_client`, `fk_document`, `detail_type_doc_document`, `revision_type_doc_document`) VALUES (" . $ _POST["type"] . ", " . $_POST["categorie"] . ", " . $_POST["monde"] . ", " . $_SESSION["client"] . ",'" . $_POST["filename"] . "', '', 1);";
    
    if ($mysqli->multi_query($query)) {
        $i = 0; 
        do { 
            $i++; 
        } while ($mysqli->next_result()); 
        
        if (!$mysqli->errno) { 
            status(200);
        } else {
            status(500);
            $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
        }
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
    }
    
} else {
    status(403);
    $json = '{ "error": "nosession" }';
}

header('Content-Type: application/json');
echo $json;
?>
