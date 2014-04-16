<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

if ($_SESSION["niveau"] == 999) {
    include("../includes/PDO.php");  
    
    $retour = [ 
        "action" => "",
        "client" => 0,
        "users" => [],
        "produits" => [],
        "messages" =>  [],
    ];
    
    $result_users = dino_query("superadmin_users", []);
    
    if ($result_users["status"]) {
        
        $users = [];
        
        foreach($result_users["result"] as $row_users) {
            array_push($users, [
                "login" => $row["login_user"],
                "mail" => $row["mail_user"],
                "client" => $row["pk_client"],
                "mailclient" => $row["mail_client"]
            ]);
        }
        
        $retours["users"] = $users;
        
        $result = dino_query("superadmin_produits", []);
        
        
        $json = json_encode($retour);
        status(200);
        header('Content-Type: application/json');
        echo $json;
    } else {
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Quelqu'un joue au superadmin!"
    ]);
    status(403);
}
?>
