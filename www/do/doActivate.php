<?php
include("includes/PDO.php");
include("includes/status.php");
include("includes/log.php");

$params = [
    "mail" => $_POST["mail"],
    "activation" => $_POST["key"]
];

$result = dino_query("activate_select", $params);

if ($result["status"]) {
    if (count($result["result"]) > 0) {
        $login = $result["result"][0]["login_user"];
        
        $params_activate = [
            "login" => $login
        ];
        
        if (dino_query("activate_final", $params_activate)) {
            status(200);         
        } else {
            status(500);
        }
    }
    else {
        status(204);
    }
} else {
    status(500);
}

?>
