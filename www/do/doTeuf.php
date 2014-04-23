<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

if ($_SESSION["niveau"] == 999) {
    include("../includes/PDO.php");
    
    $err = false;
    
    $params = [
    ];
    
    $result = dino_query("teuf_clients", $params);
    
    if ($result["status"]) {
        foreach($result["result"] as $row) {
            for ($i = 1;$i <= 5;$i++) {
                $result_client = dino_query("token_insert", [
                    "client" => $row["pk_client"],
                    "produit" => 1,
                    "combo" => 1,
                    "quantite" => 1,
                    "expire" => "3014-01-01",
                    "paid" => 1
                ]);
            
                if (!$result_client["status"]) {
                    $err = true;
                    break;
                }
            }
            
            if ($err) {
                break;
            }
        }
        
        if (!$err) {
            status(200);
        } else {
            status(500);
        }
    } else {
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Petit pédé se prend pour un superadmin!"
    ]);
    header("Location: ../index.php");
}
?>
