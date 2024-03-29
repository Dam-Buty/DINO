<?php
session_start();
include("../includes/functions.php");  

if (isset($_SESSION["niveau"])) {
            
    try {
        $dino = new DINOSQL();
        
        $params = [
            "client" => $_SESSION["client"],
            "user" => $_SESSION["user"],
            "niveau" => $_SESSION["niveau"]
        ];
        
        $result = $dino->query("json_queue", $params);
        
        $queue = [ ];
        
        foreach($result as $row) {
        
            $date = substr($row["date_doc"], 8, 2) . "/" . substr($row["date_doc"], 5, 2);

            if ($row["fk_user"] == $_SESSION["user"]) {
                $user = "usted";
            } else {
                $user = $row["fk_user"];
            }
            
            array_push($queue, [
                "size" => $row["taille_document"],
                "filename" => $row["filename_document"],
                "displayname" => $row["display_document"],
                "user" => $user,
                "date" => "el " . $date
            ]);
        }
        status(200);
        header('Content-Type: application/json');
        echo json_encode($queue);
    } catch (Exception $e) {
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "JSON queue : pas de niveau session"
    ]);
    status(403);
}
?>
