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
	            $query_check = "
	                SELECT `filename_document`
	                FROM `document`
	                WHERE
	                    `fk_client` = :client
	                    AND `job_document` = :job
	            ;";
	            
                $result_check = dino_query($query_check,[
                    "client" => $_SESSION["client"],
                    "job" => $elements[1]
                ]);
	            
	            if ($result_check["status"]) {
	                if (count($result_check["result"]) == 0) {
                        $query = "
                            INSERT INTO `document` (
                                `filename_document`, 
                                `job_document`,
                                `taille_document`, 
                                `display_document`, 
                                `fk_client`, 
                                `fk_user`, 
                                `date_upload_document`,
                                `niveau_document`
                            ) VALUES (
                                :filename, 
                                :job,
                                :taille, 
                                :display, 
                                :client, 
                                :user, 
                                :date,
                                999
                            )
                        ;";
                        
                        $result = dino_query($query,[
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
                                write_log([
                                    "libelle" => "UNCAVE document",
                                    "admin" => 0,
                                    "query" => $query,
                                    "statut" => 0,
                                    "message" => "",
                                    "erreur" => "",
                                    "document" => $filename,
                                    "objet" => $file
                                ]);
                            } else {
                                status(500);
                                write_log([
                                    "libelle" => "MOVE caved document",
                                    "admin" => 0,
                                    "query" => $cave_path . $file,
                                    "statut" => 1,
                                    "message" => "",
                                    "erreur" => "Pas de permission?",
                                    "document" => "",
                                    "objet" => $filename
                                ]);
                                $err = true;
                                break;
                            }
                        } else {
                            status(500);
                            write_log([
                                "libelle" => "INSERT nouveau document",
                                "admin" => 0,
                                "query" => $query,
                                "statut" => 1,
                                "message" => $result["errinfo"][2],
                                "erreur" => $result["errno"],
                                "document" => "",
                                "objet" => $filename
                            ]);
                            $err = true;
                            break;
                        }
	                }
	            } else {
                    status(500);
                    write_log([
                        "libelle" => "CHECK nouveau document",
                        "admin" => 0,
                        "query" => $query_check,
                        "statut" => 1,
                        "message" => $result["errinfo"][2],
                        "erreur" => $result["errno"],
                        "document" => $file,
                        "objet" => $elements[1]
                    ]);
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
    write_log([
        "libelle" => "GET le contenu de la cave",
        "admin" => 0,
        "query" => $cave_path,
        "statut" => 1,
        "message" => "Pas de permission ?",
        "erreur" => "",
        "document" => "",
        "objet" => ""
    ]);
}

?>
