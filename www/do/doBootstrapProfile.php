<?php
session_start();
include("../includes/functions.php");

if (isset($_SESSION)) {

    
    try {
        $dino = new DINOSQL();
        $dir = new DirectoryIterator("../templates/default");
        $templates = [];
        
        foreach ($dir as $file) {
            if (!$file->isDot()) {
                if ($file->getExtension() == "template") {
                    array_push($templates, $file->getFilename());
                }
            }
        }
        
        foreach ($templates as $template) {
            // Création du monde
            $monde = str_replace(".template", "", $template);
            
            $pk_monde = $dino->query("monde_add", [
                "label" => $monde,
                "client" => $_SESSION["client"]
            ]);
            
            $dino->query("droits_final", [
                "client" => $_SESSION["client"],
                "monde" => $pk_monde,
                "login" => $_SESSION["user"]
            ]);
            
            $content = file_get_contents("../templates/default/" . $template);
            
            $in = false;
            
            foreach(explode("\n", $content) as $i => $ligne) {
                if (!$in) {
                    if ($ligne == "==") {
                        $in = true;
                    }
                } else {
                    if ($ligne != "") {
                        $params = explode("/", explode(" ", $ligne, 2)[1]);
                        
                        if (substr($ligne, 0, 1) == "*") {
                            $pk_champ = $dino->query("monde_champ_add", [
                                "label" => $params[0],
                                "pluriel" => $params[0] . "(s)",
                                "monde" => $pk_monde,
                                "client" => $_SESSION["client"]
                            ]);
                        } else {
                            $params_type = [
                                "label" => "",
                                "detail" => false,
                                "time" => false,
                                "niveau" => 0,
                                "categorie" => 0,
                                "champ" => $pk_champ,
                                "monde" => $pk_monde,
                                "client" => $_SESSION["client"]
                            ];
                            
                            foreach($params as $j => $param) {
                                if ($params_type["label"] == "") {
                                    $params_type["label"] = $param;
                                } else {
                                    switch($param) {
                                        case "D":
                                            $params_type["detail"] = true;
                                            break;
                                        case "M":
                                            $params_type["time"] = true;
                                            break;
                                        default:
                                            $params_type["niveau"] = $param;
                                            break;
                                    };
                                }
                            }
                            
                            $dino->query("monde_type_add", $params_type);
                        }
                    }
                }
            }
        }
        
        $dino->commit();
        status(200);
    } catch (Exception $e) {
        $dino->rollback();
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Pas de session!"
    ]);
    status(403);
}
?>
