<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/PDO.php");
    include("../../includes/status.php");
    
    $query = "
        DELETE FROM `monde` 
        WHERE 
            `pk_monde` = :pk 
            AND `fk_client` = :client ;"; 
            
    $result = dino_query($query,[
        "client" => $_POST["client"],
        "pk" => $_POST["pk"]
    ]);
    
    if ($result["status"]) {
        status(200);
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $result["errinfo"][2] . '" }';
    }
    
    header('Content-Type: application/json');
    echo $json;
}
?>
