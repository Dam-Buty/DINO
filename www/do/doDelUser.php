<?php
session_start();
if ($_SESSION["niveau"] >= 20) {
    include("../includes/mysqli.php");
    include("../includes/status.php");
    
    $query_user = "
        DELETE FROM `user`
        WHERE
            `fk_client` = " . $_SESSION["client"] . "
            AND `niveau_user` <= " . $_SESSION["niveau"] . "
            AND `login_user` = '" . $_POST["login"] . "'
    ;";
    
    if ($mysqli->query($query_user)) {
        status(204);
    } else {
        status(500);
        $json = '{ "error": "mysql", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
    }
    
    header('Content-Type: application/json');
    echo $json;
} else {
    header("Location: ../index.php");
}
?>
