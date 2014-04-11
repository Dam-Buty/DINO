<?php
include("../includes/PDO.php");
include("../includes/status.php");
include("../includes/log.php");

$params = [
    "login" => $_POST["user"],
    "mail" => urldecode($_POST["mail"])
];

$result = dino_query("activate_select", $params);

if ($result["status"]) {
    if (count($result["result"]) > 0) {        
        $row = $result["result"][0];
        
        if ($row["activation_user"] == "") {
            status(200);
        } else {
            if ($row["activation_user"] == $_POST["key"]) {
                $login = $_POST["user"];
                
                $params_activate = [
                    "login" => $login
                ];
                
                if (dino_query("activate_final", $params_activate)) {
                    status(200);
                } else {
                    status(500);
                }
            } else {
                status(204);
            }
        }
    } else {
        status(204);
    }
} else {
    status(500);
}

?>
