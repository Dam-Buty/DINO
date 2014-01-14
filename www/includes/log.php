<?php

function write_log($params) {
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

    $query_log = "
        INSERT INTO `log` (
            `date_operation`, 
            `fk_user`, 
            `fk_client`, 
            `libelle_operation`, 
            `admin_operation`, 
            `query_operation`, 
            `statut_operation`, 
            `message_operation`, 
            `erreur_operation`, 
            `document_operation`, 
            `objet_operation`,
            `referrer_operation`,
            `ip_operation`
        ) VALUES (
            :date,
            :user,
            :client,
            :libelle,
            :admin,
            :query,
            :statut,
            :message,
            :erreur,
            :document,
            :objet,
            :referrer,
            :ip
        )
    ;";
        
    $params_log = [
        "date" => date("Y-m-d H:i:s"),
        "user" => $user ,
        "client" => $client,
        "libelle" => $params["libelle"],
        "admin" => $params["admin"],
        "query" => $params["query"],
        "statut" => $params["statut"],
        "message" => $params["message"],
        "erreur" => $params["erreur"],
        "document" => $params["document"],
        "objet" => $params["objet"],
        "referrer" => $_SERVER['HTTP_REFERER'],
        "ip" => $_SERVER['REMOTE_ADDR']
    ];

    dino_query($query_log, $params_log);
}
?>
