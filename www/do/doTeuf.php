<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

if ($_SESSION["niveau"] == 666) {
    include("../includes/DINOSQL.php");
    
    try {
        $dino = new DINOSQL();
        
        $result = $dino->query("teuf_clients", []);
        
        foreach($result["result"] as $row) {
            for ($i = 1;$i <= 5;$i++) {
                $result_client = $dino->query("token_insert", [
                    "client" => $row["pk_client"],
                    "produit" => 1,
                    "combo" => 1,
                    "quantite" => 1,
                    "expire" => "3014-01-01",
                    "paid" => 1
                ]);
            }
        }
        
        $dino->commit();
        status(200);
    } catch (Exception $e) {
        $dino->rollback();
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Petit pédé se prend pour un superadmin!"
    ]);
    status(403);
}
?>
