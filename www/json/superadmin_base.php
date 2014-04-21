<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

if ($_SESSION["niveau"] == 999) {
    include("../includes/PDO.php");  
    
    $retour = [ 
        "action" => "",
        "client" => 0,
        "clients" => [],
        "produits" => [],
        "combos" => [],
        "messages" =>  [],
    ];
    
    $result_users = dino_query("superadmin_users", []);
    
    if ($result_users["status"]) {
        
        $clients = [];
        $client = 0;
        
        foreach($result_users["result"] as $row_users) {
            if ($client != $row_users["pk_client"]) {
                $clients[$row_users["pk_client"]] = [
                    "pk" => $row_users["pk_client"],
                    "mail" => $row_users["mail_client"],
                    "gestionnaire" => "",
                    "users" => []
                ];
                $client = $row_users["pk_client"];
            }
            
            if ($row_users["gestionnaire"] == 1) {
                $clients[$row_users["pk_client"]]["gestionnaire"] = $row_users["login_user"];
            }
            
            array_push($clients[$row_users["pk_client"]]["users"], [
                "login" => $row_users["login_user"],
                "mail" => $row_users["mail_user"],
                "activated" => $row_users["activated"]
            ]);
            
        }
        
        $retour["clients"] = $clients;
        
        $result_produits = dino_query("superadmin_produits", []);
    
        if ($result_produits["status"]) {
        
            $produits = [];
        
            foreach($result_produits["result"] as $row_produits) {
                $produits[$row_produits["pk_produit"]] = $row_produits["label_produit"];
            }
            
            $retour["produits"] = $produits;
            
            $result_messages = dino_query("superadmin_messages", []);

            if ($result_messages["status"]) {
            
                $messages = [];
            
                foreach($result_messages["result"] as $row_messages) {
                    $messages[$row_messages["pk_message"]] = [
                        "titre" => $row_messages["titre_message"],
                        "html" => $row_messages["html_message"]
                    ];
                }
                
                $retour["messages"] = $messages;
        
                $result_combos = dino_query("superadmin_combos", []);

                if ($result_combos["status"]) {
                
                    $combos = [];
                
                    foreach($result_combos["result"] as $row_combos) {
                        $combos[$row_combos["pk_combo"]] = $row_combos["label_combo"];
                    }
                    
                    $retour["combos"] = $combos;
            
                    $json = json_encode($retour);
                    status(200);
                    header('Content-Type: application/json');
                    echo $json;
                    
                } else {
                    status(500);
                }
                
            } else {
                status(500);
            }
            
            
        } else {
            status(500);
        }
    } else {
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
