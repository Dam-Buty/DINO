<?php
session_start();
if ($_SESSION["niveau"] >= 20) {
    include("../includes/mysqli.php");
    include("../includes/status.php");
    
    // On identifie d'abord les documents à déclassifier
    $query_documents = "
        SELECT `filename_document`
        FROM `document` AS `d`, `document_valeur_champ` AS `dvc`
        WHERE
            `d`.`fk_client` = " . $_SESSION["client"] . "
            
            AND `dvc`.`fk_client` = " . $_SESSION["client"] . "
            AND `dvc`.`fk_monde` = " . $_POST["monde"] . "
            AND `dvc`.`fk_champ` = " . $_POST["champ"] . "
            AND `dvc`.`fk_valeur_champ` = " . $_POST["pk"] . "
            
            AND `dvc`.`fk_document` = `d`.`filename_document`
    ;";
    
    // Puis on prépare la requete de delete :
    // - DELETE la valeur_champ et ses enfants
    // - DELETE les associations à des utilisateurs
    $query_delete = "
        DELETE FROM `valeur_champ`
        WHERE
            `fk_client` = " . $_SESSION["client"] . "
            AND `fk_monde` = " . $_POST["monde"] . "
            AND ((
                    `fk_champ` = " . $_POST["champ"] . "
                    AND `pk_valeur_champ` = " . $_POST["pk"] . "
                    AND `fk_parent` = " . $_POST["parent"] . "
                )
                OR `fk_parent` = " . $_POST["pk"] . "
            )
    ;
        DELETE FROM `user_valeur_champ`
        WHERE   
            `fk_client` = " . $_SESSION["client"] . "
            AND `fk_monde` = " . $_POST["monde"] . "
            AND `fk_champ` = " . $_POST["champ"] . "
            AND `fk_valeur_champ` = " . $_POST["pk"] . "
    ;";
    
    $error = false;
    
    if ($res_documents = $mysqli->query($query_documents)) {
        while ($row_documents = $res_documents->fetch_assoc()) {
            echo "Test: " . $row_documents["filename_document"] . "\n";
            // - Met le niveau du document à NULL pour que la queue le rattrape
            //   et DELETE ses autres valeurs de champ et type doc
            $query_delete .= "
                UPDATE `document`
                SET `niveau_document` = NULL
                WHERE 
                    `fk_client` = " . $_SESSION["client"] . "
                    AND `filename_document` = '" . $row_documents["filename_document"] . "'
            ;
                DELETE FROM `type_doc_document`
                WHERE 
                    `fk_client` = " . $_SESSION["client"] . "
                    AND `fk_document` = '" . $row_documents["filename_document"] . "'
            ;
                DELETE FROM `document_valeur_champ`
                WHERE 
                    `fk_client` = " . $_SESSION["client"] . "
                    AND `fk_document` = '" . $row_documents["filename_document"] . "'
            ;";
        }
    } else {
        $error = true;
        status(500);
        $json = '{ "error": "mysql", "query": "' . $query_documents . '", "message": "' . $mysqli->error . '" }';
    }

    if (!$error) {
        if ($mysqli->multi_query($query_delete)) {
            $i = 0; 
            do { 
                $i++; 
            } while ($mysqli->next_result()); 
            
            if (!$mysqli->errno) { 
                status(200);
                $json = '{ "query": "' . $query_delete . '" }';
            } else {
                status(500);
                $json = '{ "error": "mysqli", "query": "' . $query_delete . '", "message": "' . $mysqli->error . '" }';
            }
        } else {
            status(500);
            $json = '{ "error": "mysqli", "query": "' . $query_delete . '", "message": "' . $mysqli->error . '" }';
        } 
    }     
    
    header('Content-Type: application/json');
    echo $json;
} else {
    header("Location: ../index.php");
}
?>
