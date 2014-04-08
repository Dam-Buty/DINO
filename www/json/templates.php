<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

if ($_SESSION["niveau"] >= 30) {

    $dir = new DirectoryIterator("../templates");
    $templates = [];
    
    foreach ($dir as $file) {
        if (!$file->isDot()) {
            if ($file->getExtension() == "template") {
                $content = file_get_contents("../templates/" . $file->getFilename());
                
                $template = [
                    "titre" => "",
                    "champs" => [],
                    "description" => ""
                ];
                
                $in = false;
                $n = -1;
                
                foreach(explode("\n", $content) as $i => $ligne) {
                    if (!$in) {
                        if ($ligne != "==") {
                            $template["titre"] = $ligne;
                        } else {
                            $in = true;
                        }
                    } else {
                        if ($ligne != "") {
                            $params = explode("/", explode(" ", $ligne)[1]);
                            
                            if (substr($ligne, 0, 1) == "*") {
                                array_push($template["champs"], [
                                    "label" => $params[0],
                                    "pluriel" => $params[1],
                                    "categories" => [],
                                    "types" => []
                                ]);
                                
                                $n++;
                            } else {
                                $type = [
                                    "label" => "",
                                    "detail" => false,
                                    "time" => false,
                                    "niveau" => 0
                                ];
                                
                                foreach($params as $j => $param) {
                                    if ($type["label"] == "") {
                                        $type["label"] = $param;
                                    } else {
                                        switch($param) {
                                            case "D":
                                                $type["detail"] = true;
                                                break;
                                            case "M":
                                                $type["time"] = true;
                                                break;
                                            default:
                                                $type["niveau"] = $param;
                                                break;
                                        };
                                    }
                                }
                                
                                array_push($template["champs"][$n]["types"], $type);
                            }
                        }
                    }
                }
                
                $template["description"] = file_get_contents("../templates/" . str_replace(".template", ".html", $file->getFilename()));
                
                array_push($templates, $template);
            }
        }
    } // FIN FOREACH
    
    status(200);
    dino_log([
        "niveau" => "I",
        "message" => "Récupération templates",
        "query" => ""
    ]);
    header('Content-Type: application/json');
    echo json_encode($templates);
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Templates : droits insuffisants"
    ]);
    status(403);
}
?>
