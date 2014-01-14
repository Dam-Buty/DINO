<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

$champs = array_filter($_POST["champs"]);

if ($_SESSION["niveau"] >= 10) {
    include("../includes/mysqli.php");
    
    $query = "
        SELECT `revision_type_doc` 
        FROM `type_doc_document` AS `tdd`
        WHERE `tdd`.`fk_client` = :client 
            AND `tdd`.`fk_monde` = :monde
            AND `tdd`.`fk_categorie_doc` = :categorie
            AND `tdd`.`fk_type_doc` = :type 
            AND `tdd`.`detail_type_doc` = :detail
            
    ";
    
    $params = [
        "client" => $_SESSION["client"],
        "monde" => $_POST["monde"],
        "categorie" => $_POST["categorie"],
        "type" => $_POST["type"],
        "detail" => $_POST["detail"]
    ];
            
            foreach($champs as $pk => $valeur) {
                $query .= " 
            AND (
                SELECT COUNT(*) 
                FROM `document_valeur_champ` AS `dvc` 
                WHERE `dvc`.`fk_client` = :client" . $pk . "
                    AND `dvc`.`fk_monde` = :monde" . $pk . "
                    AND `dvc`.`fk_champ` = :pk" . $pk . "
                    AND `dvc`.`fk_valeur_champ` = :valeur" . $pk . "
                    AND `dvc`.`fk_document` = `tdd`.`fk_document`
                ) > 0";
                
                array_push($params, [
                    "client" . $pk => $_SESSION["client"],
                    "monde" . $pk => $_POST["monde"],
                    "pk" . $pk => $pk,
                    "valeur" . $pk => $valeur
                ])
            }
    $query .= "
        ;";      
    
    $result = dino_query($query, $params);
                             
    if ($result["status"]) {
        if (count($result["result"]) > 0) {
            status(200);
        } else {
            status(204);
        }
    } else {
        status(500);
        write_log([
            "libelle" => "CHECK revision",
            "admin" => 0,
            "query" => $query,
            "statut" => 1,
            "message" => $result["errinfo"][2],
            "erreur" => $result["errno"],
            "document" => "",
            "objet" => $_POST["filename"]
        ]);
    }    
} else {
    status(403);
    write_log([
        "libelle" => "CHECK revision",
        "admin" => 0,
        "query" => $query,
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_POST["filename"]
    ]);
}
?>
