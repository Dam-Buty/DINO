<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/mysqli.php");
    include("../../includes/status.php");
    
    $query = "SELECT `pk_champ`, `label_champ`, `pluriel_champ`, `public_champ`, (SELECT COUNT(*) FROM `monde_champ` WHERE `fk_champ` = `c`.`pk_champ` AND `fk_monde` = " . $_POST["monde"] . " AND `fk_client` = " . $_POST["client"] . ") AS `presence_champ` FROM `champ` AS `c` WHERE `public_champ` = 1 OR (SELECT COUNT(*) FROM `monde_champ` WHERE `fk_champ` = `c`.`pk_champ` AND `fk_monde` = " . $_POST["monde"] . " AND `fk_client` = " . $_POST["client"] . ") > 0 ORDER BY `presence_champ` DESC, `public_champ` ASC";
    
    if ($result = $mysqli->query($query)) {
        status(200);
        $json = "[ ";
        while ($row = $result->fetch_assoc()) {
            if ($json != "[ ") {
                $json .= ", ";
            }
            
            $json .= '{ "pk": "' . $row["pk_champ"] . '", "label": "' . $row["label_champ"] . '", "pluriel": "' . $row["pluriel_champ"] . '", "ispublic": "' . $row["public_champ"] . '", "presence": "' . $row["presence_champ"] . '" }';
        }
        
        $json .= " ]";
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
    }
    
    header('Content-Type: application/json');
    echo $json;
}
?>
