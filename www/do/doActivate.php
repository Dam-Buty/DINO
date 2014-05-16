<?php
include("../includes/functions.php");

try {
    $dino = new DINOSQL();

    $params = [
        "mail" => urldecode($_POST["mail"]),
        "key" => $_POST["key"]
    ];

    $result = $dino->query("activate_select", $params);
    $signedup = false;
    
    
    if (count($result) > 0) {
        $row = $result[0];
        
        $client = $row["pk_client"];
        
        if ($row["activated_client"] == 1) {
            // Si le client est déjà activé on vérifie si il a un user ou pas
            
            $result_user = $dino->query("check_user", [
                "client" => $client
            ]);
            
            
            if (count($result_user) > 0) { // Pas de user
                $mail = "signedup";
                
                $return = dinomail($_POST["mail"], $mail, [], [
                    "mail" => urldecode($_POST["mail"])
                ]);
                
                $signedup = true;
            }
        }
        
        if (!$signedup) {
            $params_activate = [
                "pk" => $client
            ];
            
            $dino->query("activate_final", $params_activate);
            
            $dino->commit();
            
            status(200);
        } else {
            status(201);
        }
    } else {
        status(204);
    }
    
} catch (Exception $e) {
    $dino->rollback();
    status(500);
}

?>
