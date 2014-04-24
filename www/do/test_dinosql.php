<?php
include("../includes/DINOSQL.php");
include("../includes/log.php");
include("../includes/status.php");

try {
    $dino = new DINOSQL();
    
    $result = $dino->query("test1", [
        "nom" => "test combo"
    ]);
    
    $result = $dino->query("test2", [
        "nom" => "test produit"
    ]);
    
    $dino->commit();
    status(200);
    
} catch (Exception $e) {
    var_dump($e);
    status(500);
}

?>
