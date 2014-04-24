<?php
include("../includes/DINOSQL.php");
include("../includes/status.php");
include("../includes/log.php");

try {
    $dino = new DINOSQL();

    $params = [
        "login" => $_POST["user"],
        "mail" => urldecode($_POST["mail"])
    ];

    $result = $dino->query("activate_select", $params);
    
    if (count($result) > 0) {
        $row = $result[0];
        
        if ($row["activation_user"] == "") {
            status(200);
        } else {
            if ($row["activation_user"] == $_POST["key"]) {
                $login = $_POST["user"];
                
                $params_activate = [
                    "login" => $login
                ];
                
                $dino->query("activate_final", $params_activate);
                
                $dino->commit();
                
                status(200);
            } else {
                status(204);
            }
        }
    } else {
        status(204);
    }
    
} catch (Exception $e) {
    status(500);
}

?>
