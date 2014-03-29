<?php
session_start();
include("../includes/PDO.php");
include("../includes/crypt.php");
include("../includes/status.php");
include("../includes/log.php");

$cave_path = "/var/spool/cups-pdf/ANONYMOUS/";
$temp_path = "../cache/" . $_SESSION["client"] . "/temp/";

if ($cave = opendir($cave_path)) {
    $err = false;
    $empty = true;

    // On liste tous les fichiers du spool
    while($file = readdir($cave)) {
        if ($file != "." && $file != "..") {
            $empty = false;
	        $elements = explode("__", $file);
	        
	        // si le document vient du printer du client
	        if ($elements[0] == $_SESSION["printer"]) {
	            $filename = genere_clef(12, TRUE);
	            $filesize = filesize($cave_path . $file);
	            
	            // On vérifie qu'il n'a pas encore été pris en compte
	            // (via son numéro de job)
	            
                $result_check = dino_query("check_cave_select",[
                    "client" => $_SESSION["client"],
                    "job" => $elements[1]
                ]);
	            
	            if ($result_check["status"]) {
	                if (count($result_check["result"]) == 0) {
                        
                        $result = dino_query("check_cave_insert",[
                            "filename" => $filename. ".pdf",
                            "job" => $elements[1],
                            "taille" => $filesize,
                            "display" => $elements[2],
                            "client" => $_SESSION["client"],
                            "user" => $_SESSION["printer"],
                            "date" => date("Y-m-d H:i:s")
                        ]);
                        
                        if ($result["status"]) {        
                            if (copy($cave_path . $file, "../cache/" . $_SESSION["client"] . "/temp/" . $filename . ".pdf")) {
                                dino_log([
                                    "niveau" => "I",
                                    "message" => "Document décavé vers ../cache/" . $_SESSION["client"] . "/temp/" . $filename . ".pdf",
                                    "query" => $cave_path . $file
                                ]);
                            } else {
                                status(500);
                                dino_log([
                                    "niveau" => "E",
                                    "message" => "Impossible de décaver vers ../cache/" . $_SESSION["client"] . "/temp/" . $filename . ".pdf",
                                    "query" => $cave_path . $file
                                ]);
                                $err = true;
                                break;
                            }
                        } else {
                            status(500);
                            $err = true;
                            break;
                        }
	                }
	            } else {
                    status(500);
                    $err = true;
                    break;
                }
	            
            }       
        }
    }
    
    if (!$err) {
        status(201);
    }
} else {
    status(500);
    dino_log([
        "niveau" => "E",
        "message" => "Impossible de vérifier la cave",
        "query" => $cave_path
    ]);
}

?>
