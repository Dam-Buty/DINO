<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/mysqli.php");
    include("../../includes/status.php");
    
    if ($_POST["pk"] == "new") {
        $query = "INSERT INTO `champ` (`label_champ`, `pluriel_champ`, `public_champ`, `multi_champ`) VALUES ('" . $_POST["label"] . "', '" . $_POST["pluriel"]. "', " . $_POST["ispublic"] . ", " . $_POST["ismulti"] . ");";
    } else {
        $query = "UPDATE `champ` SET `label_champ` = '" . $_POST["label"] . "', `pluriel_champ` = '" . $_POST["pluriel"] . "', `public_champ` = " . $_POST["ispublic"] . ", `multi_champ` = " . $_POST["ismulti"] . " WHERE `pk_champ` = " . $_POST["pk"] . ";";
    }
    
    if ($mysqli->query($query)) {
    
        if ($_POST["pk"] == "new") {
            $query2 = "INSERT INTO `monde_champ` (`fk_monde`, `fk_client`, `fk_champ`, `master_monde_champ`) VALUES (" . $_POST["monde"] . ", " . $_POST["client"] . ", " . $mysqli->insert_id . ", " . $_POST["ismaster"] . ");";
        } else {
            $query2 = "UPDATE `monde_champ` SET `master_monde_champ` = " . $_POST["ismaster"] . " WHERE `fk_monde` = " . $_POST["monde"] . " AND `fk_client` = " . $_POST["client"] . " AND `fk_champ` = " . $_POST["pk"] . ";";
            
        }
            
        if ($mysqli->query($query2)) {
            status(200);
        } else {
            status(500);
            $json = '{ "error": "mysqli", "query": "' . $query . '", "query2": "' . $query2 . '", "message": "' . $mysqli->error . '" }';
        }
        
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
    }
    
    header('Content-Type: application/json');
    echo $json;
}
?>
