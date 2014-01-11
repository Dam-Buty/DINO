<?php

function write_log($params) {
    if (!isset($_SESSION["user"])) {
        $user = "";
    } else {
        $user = $_SESSION["user"];
    }
    
    if (!isset($_SESSION["client"])) {
        $client = 0;
    } else {
        $client = $_SESSION["client"];
    }

    $query_log = "
        INSERT INTO `log` (
            `date_operation`, 
            `fk_user`, 
            `fk_client`, 
            `libelle_operation`, 
            `admin_operation`, 
            `query_operation`, 
            `statut_operation`, 
            `message_operation`, 
            `erreur_operation`, 
            `document_operation`, 
            `objet_operation`,
            `referrer_operation`
        ) VALUES (
            '" . date("Y-m-d H:i:s") . "',
            '" . $user . "', 
            " . $client . ", 
            '" . addslashes($params["libelle"]) . "', 
            " . $params["admin"] . ", 
            '" . str_replace("\n", " ", addslashes($params["query"])) . "', 
            " . $params["statut"] . ", 
            '" . str_replace("\n", " ", addslashes($params["message"])) . "', 
            '" . str_replace("\n", " ", addslashes($params["erreur"])) . "', 
            '" . $params["document"] . "', 
            '" . $params["objet"] . "',
            '" . $_SERVER['HTTP_REFERER'] . "'
        );";
#    echo $query_log;
// TODO : gestion de l'IP!

    $hostname = "localhost";
    $username = "dino_baby_root";
    $dbname = "dino_baby";
    $password = "C4dillac5";

#    $hostname = "localhost";
#    $username = "root";
#    $dbname = "dino_baby";
#    $password = "C4dillac5";

    $mysqli_log = new mysqli($hostname, $username, $password, $dbname);

    $mysqli_log->query($query_log);
#    echo $mysqli_log->error;
}
?>
