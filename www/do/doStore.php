<?php
session_start();
include("../includes/status.php");

if ($_SESSION["niveau"] > 10) {
    include("../includes/mysqli.php");
    include("../includes/crypt.php");
    
    if ($_POST["action"] == "add") {
        switch($_POST["page"]) {
            case "monde":
                $query = "UPDATE `document` SET `fk_monde` = " . $_POST["valeur_select"] . " WHERE `filename_document` = '" . $_POST["filename"] . "';";
                break;
                
            case "reference":             
                if ($_POST["new_ope"] == 1) {
                    $query = "INSERT INTO `operation` (`pk_operation`, `date_operation`, `fk_monde`, `fk_client`, `fk_user`) VALUES ('" . $_POST["valeur_input"] . "', '" . date("Y-m-d H:i:s") . "', " . $_POST["monde"] . ", " . $_SESSION["client"] . ", '" . $_SESSION["user"] . "');";
                    $query .= "UPDATE `document` SET `fk_operation` = '" . $_POST["valeur_input"] . "' WHERE `filename_document` = '" . $_POST["filename"] . "';";
                 } else {
                    $query = "UPDATE `document` SET `fk_operation` = '" . $_POST["valeur_input"] . "' WHERE `filename_document` = '" . $_POST["filename"] . "';";
                    $query .= "SELECT `fk_champ`, `fk_valeur_champ` FROM `valeur_champ` WHERE `fk_operation` = '" . $_POST["valeur_input"] . "';";
                 }
                 break;
                
            case "champ":
                if ($_POST["cyclique"] == 1) {
                    $query = "INSERT INTO `operation_valeur_champ` (`fk_operation`, `fk_monde`, `fk_client`, `fk_valeur_champ`, `fk_champ`) VALUES ('" . $_POST["reference"] . "', " . $_POST["monde"] . ", " . $_SESSION["client"] . ", " . $_POST["valeur_select"] . ", " . $_POST["pk_champ"] . ");";
                } else {
                    $query = "INSERT INTO `document_valeur_champ` (`fk_document`, `fk_monde`, `fk_client`, `fk_valeur_champ`, `fk_champ`) VALUES ('" . $_POST["filename"] . "', " . $_POST["monde"] . ", " . $_SESSION["client"] . ", " . $_POST["valeur_select"] . ", " . $_POST["pk_champ"] . ");";
                }
                break;
                
            case "type":
                $query = "INSERT INTO `type_doc_document` (`fk_type_doc`, `fk_categorie_doc`, `fk_monde`, `fk_client`, `fk_document`, `detail_type_doc_document`) VALUES (" . $_POST["valeur_select"] . ", " . $_POST["categorie"] . ", " . $_POST["monde"] . ", " . $_SESSION["client"] . ", '" . $_POST["filename"] . "', '" . $_POST["valeur_input"] . "');";
                break;
        }
        
        $json = "";
        
        if ($mysqli->multi_query($query)) {
            $i = 0; 
            
            do { 
                $i++; 
                
                if ($_POST["page"] == "reference" && $_POST["new_ope"] == 0 && $i == 2) {
                    if ($result = $mysqli->store_result()) {
                        $json = "[ ";
                        
                        while ($row = $result->fetch_row()) {
                            if ($json != "[ ") {
                                $json .= ", ";
                            }
                            
                            $json .= '{ "champ": "' . $row["fk_champ"] . '", "valeur": "' . $row["fk_valeur_champ"] . '" }';
                        }
                    }
                }
                
                $result->free();
                
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
        
    }
    
    
} else {
    status(403);
    $json = '{ "error": "nosession" }';
}

header('Content-Type: application/json');
echo $json;
?>
