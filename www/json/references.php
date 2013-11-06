<?php
session_start();

if (isset($_SESSION["niveau"])) {
    include("../includes/mysqli.php");
    include("../includes/status.php");
    
    $query = "SELECT `pk_operation`, `ref_operation` FROM `operation` AS `o` WHERE `fk_monde` = " . $_POST["monde"] . " AND `fk_client` = " . $_SESSION["client"];
    
    foreach($_POST["master"] as $pk => $valeur) {
        $query .= " AND (SELECT COUNT(*) FROM `operation_valeur_champ` as `ovc` WHERE `ovc`.`fk_operation` = `o`.`pk_operation` AND `ovc`.`fk_monde` = " . $_POST["monde"] . " AND `ovc`.`fk_client` = " . $_SESSION["client"] . " AND `ovc`.`fk_champ` = " . $pk . " AND `ovc`.`fk_valeur_champ` = " . $valeur . ") > 0";
    }
    
    $query .= " ORDER BY `pk_operation` ASC;";
    
    if ($result = $mysqli->query($query)) {
        $json = "{ ";
        while ($row = $result->fetch_assoc()) {
            if ($json != "{ ") {
                $json .= ", ";
            }
            
            $json .= '"%%OPERATION%%"';
            
            $json_operation = '"' . $row["pk_operation"] . '": {"ref": "' . $row["ref_operation"] . '", "champs": "%%CHAMPS%%" }';
            
            $query_champs = "SELECT `fk_champ`, `fk_valeur_champ` FROM `operation_valeur_champ` AS `ovc` WHERE `fk_client` = " . $_SESSION["client"] . " AND `fk_monde` = " . $_POST["monde"] . " AND `fk_operation` = " . $row["pk_operation"] . " AND ( SELECT `master_monde_champ` FROM `monde_champ` AS `mc` WHERE `mc`.`fk_champ` = `ovc`.`fk_champ` AND `mc`.`fk_client` = " . $_SESSION["client"] . " AND `mc`.`fk_monde` = " . $_POST["monde"] . " ) = 0;";
            
            if ($result_champs = $mysqli->query($query_champs)) {
                status(200);
                $json_champs = "{ ";
                
                while ($row_champs = $result_champs->fetch_assoc()) {
                    if ($json_champs != "{ ") {
                        $json_champs .= ", ";
                    }
                    
                    $json_champs .= '"' . $row_champs["fk_champ"] . '": "' . $row_champs["fk_valeur_champ"] . '"';
                } // FIN WHILE CHAMPS
                
                $json_champs .= " }";
                
                $json_operation = str_replace('"%%CHAMPS%%"', $json_champs, $json_operation);
            } else {
                status(500);
                $json = '{ "error": "mysqli", "query": "' . $query_champs . '", "message": "' . $mysqli->error . '" }';
            }
            
            $json = str_replace('"%%OPERATION%%"', $json_operation, $json);
        } // FIN WHILE OPERATIONS
        $json .= " }";
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
    }
    header('Content-Type: application/json');
    echo $json;
}
?>
