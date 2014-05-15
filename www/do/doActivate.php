<?php
include("../includes/functions.php");

try {
    $dino = new DINOSQL();

    $params = [
        "mail" => urldecode($_POST["mail"]),
        "key" => $_POST["key"]
    ];

    $result = $dino->query("activate_select", $params);
    
    if (count($result) > 0) {
        $row = $result[0];
        
        $client = $row["pk_client"];
        
        $params_activate = [
            "pk" => $client
        ];
        
        $dino->query("activate_final", $params_activate);
        
        $dino->commit();
        
        status(200);
    } else {
        status(204);
    }
    
} catch (Exception $e) {
    $dino->rollback();
    status(500);
}

?>
