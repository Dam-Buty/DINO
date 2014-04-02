<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

if ($_SESSION["niveau"] >= 10) {
    include("../includes/PDO.php");
       
    $params = [
        "client" => $_SESSION["client"],
        "monde" => $_POST["monde"],
        "champ" => $_POST["champ"],
        "categorie" => $_POST["categorie"],
        "type" => $_POST["type"],
        "detail" => $_POST["detail"],
        "filename" => $_POST["filename"],
        "dvcClient" => $_SESSION["client"],
        "dvcMonde" => $_POST["monde"],
        "dvcClient" => $_SESSION["client"],
        "dvcMonde" => $_POST["monde"],
        "dvcPk" => $_POST["maxchamp"],
        "dvcValeur" = $champs[$_POST["maxchamp"]]
    ];   
              
    if ($_POST["time"] != "000000") {
        $query .= "revisions_time";
        $params["time"] = $_POST["time"];
    } else {
        $query .= "revisions";
    }
              
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
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Affichage des révisions : droits insuffisants"
    ]);
    status(403);
}
?>
