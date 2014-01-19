<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

if (isset($_SESSION["niveau"])) {
    include("../includes/PDO.php");
    
    
    $query = "
            SELECT `fk_document`, `revision_type_doc`, 
                DATE_FORMAT(`d`.`date_document`, '%d/%m/%Y') AS `date`,
                `d`.`display_document` AS `display`
            FROM `type_doc_document` AS `tdd`, `document` AS `d`
            WHERE 
                # Jointure
                `d`.`fk_client` = `tdd`.`fk_client`
                AND `d`.`filename_document` = `tdd`.`fk_document`
                
                # Selection des documents de meme categorie, type, detail
                AND `tdd`.`fk_client` = :client
                AND `tdd`.`fk_monde` = :monde
                AND `tdd`.`fk_champ` = :champ
                AND `tdd`.`fk_categorie_doc` = :categorie
                AND `tdd`.`fk_type_doc` = :type
                AND `tdd`.`detail_type_doc` = :detail
                
                # Elimination du document quon recherche
                AND `tdd`.`fk_document` != :filename
                
                # Selection des documents ayant les memes champs
                AND ( 
                    SELECT GROUP_CONCAT( 
                        CONCAT_WS('%%', `label_valeur_champ`, `pk_valeur_champ`)
                        SEPARATOR '||'
                    )
                    FROM 
                        `valeur_champ` AS `vc2`,
                        `document_valeur_champ` AS `dvc2`
                    WHERE 
                        `dvc2`.`fk_client` = :dvc2Client
                        AND `dvc2`.`fk_monde` = :dvc2Monde
                        AND `vc2`.`fk_client` = :vc2Client
                        AND `vc2`.`fk_monde` = :vc2Monde

                        AND `vc2`.`fk_champ` = `dvc2`.`fk_champ`
                        AND `vc2`.`pk_valeur_champ` = `dvc2`.`fk_valeur_champ`

                        AND `dvc2`.`fk_document` = :vc2Filename
                    ORDER BY `vc2`.`fk_champ`
                    ) = ( 
                        SELECT GROUP_CONCAT( 
                            CONCAT_WS('%%', `label_valeur_champ`, `pk_valeur_champ`)
                            SEPARATOR '||'
                        )
                        FROM 
                            `valeur_champ` AS `vc3`,
                            `document_valeur_champ` AS `dvc3`
                        WHERE 
                            `dvc3`.`fk_client` = :dvc3Client
                            AND `dvc3`.`fk_monde` = :dvc3Monde
                            AND `vc3`.`fk_client` = :vc3Client
                            AND `vc3`.`fk_monde` = :vc3Monde

                            AND `vc3`.`fk_champ` = `dvc3`.`fk_champ`
                            AND `vc3`.`pk_valeur_champ` = `dvc3`.`fk_valeur_champ`

                            AND `dvc3`.`fk_document` = `d`.`filename_document`
                        ORDER BY `vc3`.`fk_champ`
                    )
            ORDER BY `revision_type_doc` ASC
            ;";
       
    $params = [
        "client" => $_SESSION["client"],
        "monde" => $_POST["monde"],
        "champ" => $_POST["champ"],
        "categorie" => $_POST["categorie"],
        "type" => $_POST["type"],
        "detail" => $_POST["detail"],
        "filename" => $_POST["filename"],
        "dvc2Client" => $_SESSION["client"],
        "dvc2Monde" => $_POST["monde"],
        "vc2Client" => $_SESSION["client"],
        "vc2Monde" => $_POST["monde"],
        "vc2Filename" => $_POST["filename"],
        "dvc3Client" => $_SESSION["client"],
        "dvc3Monde" => $_POST["monde"],
        "vc3Client" => $_SESSION["client"],
        "vc3Monde" => $_POST["monde"]
    ];             
    
    
    $result = dino_query($query, $params);
    
    if ($result["status"]) {
        
        $revisions = [];
        
        foreach($result["result"] as $row) {
            array_push($revisions, [
                "filename" => $row["fk_document"],
                "display" => $row["display"],
                "revision" => $row["revision_type_doc"],
                "date" => $row["date"]
            ]);
        }
        
        status(200);
        $json = json_encode($revisions);
        header('Content-Type: application/json');
        echo $json;
    } else {
        status(500);
        write_log([
            "libelle" => "GET revisions",
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
        "libelle" => "GET revisions",
        "admin" => 0,
        "query" => "",
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_POST["filename"]
    ]);
}
?>
