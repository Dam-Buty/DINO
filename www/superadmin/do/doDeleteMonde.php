<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/mysqli.php");
    include("../../includes/status.php");
    
    $query = "DELETE FROM `monde` WHERE `pk_monde` = " . $_POST["pk"] . " AND `fk_client` = " . $_POST["client"] . ";";
    
    if ($mysqli->query($query)) {
        status(200);
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
    }
    
    header('Content-Type: application/json');
    echo $json;
}
    /*$query = "DELETE FROM `monde` WHERE `pk_monde` = " . $_POST["pk"] . " AND `fk_client` = " . $_POST["client"] . ";
          DELETE FROM `champ` AS `c` WHERE `public_champ` = 0 AND `multi_champ` = 0 AND (SELECT COUNT(*) FROM `monde_champ` AS `mc` WHERE `c`.`pk_champ` = `mc`.`fk_champ` AND `mc`.`fk_monde` = " . $_POST["pk"] . " AND `mc`.`fk_client` = " . $_POST["client"] . ") > 0;
          DELETE FROM `monde_champ` WHERE `fk_monde` = " . $_POST["pk"] . " AND `fk_client` = " . $_POST["client"] . ";
          DELETE FROM `valeur_champ` as `vc` 
          WHERE 
            (SELECT `public_champ` FROM `champ` WHERE `pk_champ` = `vc`.`fk_champ`) = 0
          AND
            (SELECT `multi_champ` FROM `champ` WHERE `pk_champ` = `vc`.`fk_champ`) = 0
          AND
            (SELECT COUNT(*) FROM `monde_champ` AS `mc` WHERE `mc`.`fk_monde` = " . $_POST["pk"] . " AND `mc`.`fk_client` = " . $_POST["client"] . " AND `mc`.`fk_champ` = `vc`.`fk_champ`) > 0;
          DELETE FROM `user_valeur_champ` AS `uvc` WHERE `fk_client` = " . $_POST["client"] . " WHERE 
            (SELECT `public_champ` FROM `champ` WHERE `pk_champ` = `uvc`.`fk_champ`) = 0
          AND
            (SELECT `multi_champ` FROM `champ` WHERE `pk_champ` = `uvc`.`fk_champ`) = 0
          AND
            (SELECT COUNT(*) FROM `monde_champ` AS `mc` WHERE `mc`.`fk_monde` = " . $_POST["pk"] . " AND `mc`.`fk_client` = " . $_POST["client"] . " AND `mc`.`fk_champ` = `uvc`.`fk_champ`) > 0; 
          DELETE FROM `operation` WHERE `fk_monde` = " . $_POST["pk"] . " AND `fk_client` = " . $_POST["client"] . ";
          DELETE FROM `operation_valeur_champ` WHERE `fk_monde` = " . $_POST["pk"] . " AND `fk_client` = " . $_POST["client"] . ";
          DELETE FROM `document_valeur_champ` WHERE `fk_monde` = " . $_POST["pk"] . " AND `fk_client` = " . $_POST["client"] . ";          
          DELETE FROM `categorie` WHERE `fk_monde` = " . $_POST["pk"] . " AND `fk_client` = " . $_POST["client"] . ";
          DELETE FROM `type_doc` WHERE `fk_monde` = " . $_POST["pk"] . " AND `fk_client` = " . $_POST["client"] . ";
          DELETE FROM `type_doc_document` WHERE `fk_monde` = " . $_POST["pk"] . " AND `fk_client` = " . $_POST["client"] . ";
          UPDATE `document` SET `fk_monde` = 0, `fk_operation` = '' WHERE `fk_monde` = " . $_POST["pk"] . " AND `fk_client` = " . $_POST["client"] . ";";*/
?>
