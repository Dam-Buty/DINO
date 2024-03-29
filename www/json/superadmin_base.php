<?php
session_start();
include("../includes/functions.php");  

if ($_SESSION["niveau"] == 999) {
    
    try {
        $dino = new DINOSQL();
        
        $retour = [ 
            "action" => "",
            "client" => 0,
            "clients" => [],
            "produits" => [],
            "combos" => []
        ];
        
        $result_users = $dino->query("superadmin_users", []);
            
        $clients = [];
        $client = 0;
        
        foreach($result_users as $row_users) {
            if ($client != $row_users["pk_client"]) {
                $clients[$row_users["pk_client"]] = [
                    "pk" => $row_users["pk_client"],
                    "mail" => $row_users["mail_client"],
                    "inscription" => $row_users["inscription_client"],
                    "contact" => $row_users["contact_client"],
                    "gestionnaire" => "",
                    "recent" => $row_users["recent"],
                    "users" => [],
                    "demandes" => []
                ];
                $client = $row_users["pk_client"];
                
                $demandes_mondes = $dino->query("demandes_mondes", [
                    "client" => $client
                ]);
                
                foreach($demandes_mondes as $i => $demande) {
                    array_push($clients[$client]["demandes"], [
                        "pk" => $demande["pk_monde"],
                        "label" => $demande["label_monde"],
                        "demande" => $demande["demande_suppr_monde"]
                    ]);
                }
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
        
        $result_produits = $dino->query("superadmin_produits", []);

        $produits = [];

        foreach($result_produits as $row_produits) {
            $produits[$row_produits["pk_produit"]] = $row_produits["label_produit"];
        }
        
        $retour["produits"] = $produits;

        $result_combos = $dino->query("superadmin_combos", []);

        $combos = [];

        foreach($result_combos as $row_combos) {
            $combos[$row_combos["pk_combo"]] = $row_combos["label_combo"];
        }
        
        $retour["combos"] = $combos;

        $json = json_encode($retour);
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
