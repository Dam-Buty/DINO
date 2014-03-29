<?php
session_start();
include("../includes/log.php");
if ($_SESSION["niveau"] >= 20) {
    include("../includes/PDO.php");
    include("../includes/status.php");
    
    $result = dino_query("check_documents_valeur",[
        "dClient" => $_SESSION["client"],
        "dvcClient" => $_SESSION["client"],
        "monde" => $_POST["monde"],
        "champ" => $_POST["champ"],
        "pk" => $_POST["pk"]
    ]);
    
    if ($result["status"]) {
        status(200);
        $json = count($result["result"]);
        header('Content-Type: application/json');
        echo $json;
    } else {
        status(500);
    }

} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Vérifie si des documents sont associés à une valeur de champ"
    ]);
    header("Location: ../index.php");
}
?>
