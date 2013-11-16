<?php
session_start();
include("../includes/status.php");

function format_date($date) {
    $d = substr($date, 0, 2);
    $m = substr($date, 3, 2);
    $y = substr($date, 6, 4);
    
    return $y . "-" . $m . "-" . $d;
}

$champs = array_filter($_POST["champs"]);

if ($_SESSION["niveau"] > 10) {
    include("../includes/mysqli.php");
    
    $query = "
        UPDATE `document` 
        SET 
            niveau_document = 10, 
            date_document = '" . format_date($_POST["date"]) . "' 
        WHERE `filename_document` = '" . $_POST["filename"] . "';
        INSERT INTO `type_doc_document` (
            `fk_type_doc`, 
            `fk_categorie_doc`, 
            `fk_champ`, 
            `fk_monde`, 
            `fk_client`, 
            `fk_document`, 
            `detail_type_doc`, 
            `revision_type_doc`
        ) VALUES (
            " . $_POST["type"] . ", 
            " . $_POST["categorie"] . ", 
            " . $_POST["maxchamp"] . ", 
            " . $_POST["monde"] . ", 
            " . $_SESSION["client"] . ", 
            '" . $_POST["filename"] . "', 
            '" . $_POST["detail"] . "', 
            (
                SELECT COALESCE(MAX(`revision_type_doc`) + 1, 1) 
                FROM (
                    SELECT `revision_type_doc` 
                    FROM `type_doc_document` AS `tdd`
                    WHERE `tdd`.`fk_client` = " . $_SESSION["client"] . " 
                        AND `tdd`.`fk_monde` = " . $_POST["monde"] . " 
                        AND `tdd`.`fk_categorie_doc` = " . $_POST["categorie"] . " 
                        AND `tdd`.`fk_type_doc` = " . $_POST["type"] . " ";
                        
                        foreach($champs as $pk => $valeur) {
                            $query .= " 
                        AND (
                            SELECT COUNT(*) 
                            FROM `document_valeur_champ` AS `dvc` 
                            WHERE `dvc`.`fk_client` = '" . $_SESSION["client"] . "' 
                                AND `dvc`.`fk_monde` = " . $_POST["monde"] . " 
                                AND `dvc`.`fk_champ` = " . $pk . "
                                AND `dvc`.`fk_valeur_champ` = " . $valeur . "
                                AND `dvc`.`fk_document` = `tdd`.`fk_document`
                            ) > 0";
                        }
    
     $query .= ") AS `magic_revision` 
            )
        );";
    
    foreach($champs as $pk => $valeur) {
        $query .= "INSERT INTO `document_valeur_champ` (
                    `fk_document`, 
                    `fk_monde`, 
                    `fk_client`, 
                    `fk_valeur_champ`, 
                    `fk_champ`
                ) VALUES (
                    '" . $_POST["filename"] . "', 
                    " . $_POST["monde"] . ", 
                    " . $_SESSION["client"] . ", 
                    " . $valeur . ", 
                    " . $pk . "
                );";
    }
                
    if ($mysqli->multi_query($query)) {
        $i = 0; 
        do { 
            $i++; 
        } while ($mysqli->next_result()); 
        
        if (!$mysqli->errno) { 
            status(200);
            $json = '{ "query": "' . $query . '" }';
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
