<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

if (isset($_SESSION["niveau"])) {
    include("../includes/mysqli.php");
    
    $query = "
            SELECT `fk_document`, `revision_type_doc`, 
                DATE_FORMAT(`d`.`date_document`, '%d/%m/%Y') AS `date`
            FROM `type_doc_document` AS `tdd`, `document` AS `d`
            WHERE 
                # Jointure
                `d`.`fk_client` = `tdd`.`fk_client`
                AND `d`.`filename_document` = `tdd`.`fk_document`
                
                # Selection des documents de meme categorie, type, detail
                AND `tdd`.`fk_client` = " . $_SESSION["client"] . " 
                AND `tdd`.`fk_monde` = " . $_POST["monde"] . "
                AND `tdd`.`fk_champ` = " .$_POST["champ"] . "
                AND `tdd`.`fk_categorie_doc` = " . $_POST["categorie"] . "
                AND `tdd`.`fk_type_doc` = " . $_POST["type"] . "
                AND `tdd`.`detail_type_doc` = '" . $_POST["detail"] . "'
                
                # Elimination du document qu'on recherche
                AND `tdd`.`fk_document` != '" . $_POST["filename"] . "'
                
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
                        `dvc2`.`fk_client` = " . $_SESSION["client"] . "
                        AND `dvc2`.`fk_monde` = " . $_POST["monde"] . "
                        AND `vc2`.`fk_client` = " . $_SESSION["client"] . "
                        AND `vc2`.`fk_monde` = " . $_POST["monde"] . "

                        AND `vc2`.`fk_champ` = `dvc2`.`fk_champ`
                        AND `vc2`.`pk_valeur_champ` = `dvc2`.`fk_valeur_champ`

                        AND `dvc2`.`fk_document` = '" . $_POST["filename"] . "'
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
                            `dvc3`.`fk_client` = " . $_SESSION["client"] . "
                            AND `dvc3`.`fk_monde` = " . $_POST["monde"] . "
                            AND `vc3`.`fk_client` = " . $_SESSION["client"] . "
                            AND `vc3`.`fk_monde` = " . $_POST["monde"] . "

                            AND `vc3`.`fk_champ` = `dvc3`.`fk_champ`
                            AND `vc3`.`pk_valeur_champ` = `dvc3`.`fk_valeur_champ`

                            AND `dvc3`.`fk_document` = `d`.`filename_document`
                        ORDER BY `vc3`.`fk_champ`
                    )
            ORDER BY `revision_type_doc` ASC
            ;";
    
    if ($result = $mysqli->query($query)) {
        
        $revisions = [];
        
        while ($row = $result->fetch_assoc()) {
            array_push($revisions, [
                "filename" => $row["fk_document"],
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
            "message" => "",
            "erreur" => $mysqli->error,
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
