<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

if ($_SESSION["niveau"] == 999) {
    include("../includes/DINOSQL.php");  
    
    $retour = [];
    
    try {
        $dino = new DINOSQL();
        
        $result_cadeaux = $dino->query("superadmin_cadeaux", [
            "client" => $_POST["client"]
        ]);
            
        $cadeaux = [];
        
        foreach($result_cadeaux as $row_cadeaux) {            
            array_push($cadeaux, [
                "pk" => $row_cadeaux["pk_token"],
                "quantite" => $row_cadeaux["quantite_token"],
                "expire" => $row_cadeaux["expire_token"],
                "date" => $row_cadeaux["date_token"],
                "expired" => $row_cadeaux["expired_token"],
                "used" => $row_cadeaux["used"],
                "cadeau" => $row_cadeaux["cadeau_token"],
                "produit" => $row_cadeaux["fk_produit"],
                "combo" => $row_cadeaux["fk_combo"]
            ]);
        }
        
        $json = json_encode($cadeaux);
        status(200);
        header('Content-Type: application/json');
        echo $json;
    } catch (Exception $e) {
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Un petit batard joue au superadmin!"
    ]);
    status(403);
}
?>
