<?php

function dino_log($params) {
    if (!isset($_SESSION["user"])) {
        $user = "";
    } else {
        $user = $_SESSION["user"];
    }
    
    if (!isset($_SESSION["client"])) {
        $client = 0;
    } else {
        $client = $_SESSION["client"];
    }
    
    $tableau_log = [
        $params["niveau"],
        date("Y-m-d H:i:s"),
        $client,
        $user
    ];
    
    switch($params["niveau"]) {
        case "D": array_push($tableau_log, $params["message"]);
            break;
        case "I":
            array_push($tableau_log, $params["query"]);
            array_push($tableau_log, $params["message"]);
            break;
        case "W":
        
            break;
        case "E":
            array_push($tableau_log, $params["query"]);
            array_push($tableau_log, $params["errno"]);
            array_push($tableau_log, $params["errinfo"]);
            array_push($tableau_log, $params["params"]);
            break;
        case "X":
            array_push($tableau_log, $params["message"]);
            array_push($tableau_log, $params["errinfo"]);
            break;
        case "Z":
            array_push($tableau_log, "Accés non autorisé!");
            array_push($tableau_log, $params["query"]);
            break;
             
    };
    
    array_push($tableau_log, $_SERVER['HTTP_REFERER']);
    array_push($tableau_log, $_SERVER['REMOTE_ADDR']);
    
    $tableau_final = [];
    
    foreach($tableau_log as $ligne) {
        array_push($tableau_final, str_replace(PHP_EOL, "|", $ligne));
    }
    
    $ligne_log = join("|", $tableau_final) . "\r\n";
        
    $path = "../log/" . date("Y-m-d") . "_" . $client . ".csv";
    
    file_put_contents($path, $ligne_log, FILE_APPEND);
}

function debug($message) {
    dino_log([
        "niveau" => "D",
        "message" => $message
    ]);
}
?>
