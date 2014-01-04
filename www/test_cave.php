<?php
session_start();
include("../includes/mysqli.php");
include("../includes/crypt.php");
include("../includes/status.php");
include("../includes/log.php");

$cave_path = "/var/spool/cups-pdf/ANONYMOUS/";

if ($cave = opendir($cave_path)) {
    $err = false;
    $documents = [];

    while($file = readdir($cave)) {
        if ($file != "." && $file != "..") {
	        $elements = explode("__", $file);
	        
	        if ($elements[0] == $_SESSION["printer"]) {
	            $filename = genere_clef(12, TRUE);
	            $filesize = filesize($cave_path . $file);
	            
                $query = "
                    INSERT INTO `document` (
                        `filename_document`, 
                        `taille_document`, 
                        `display_document`, 
                        `fk_client`, 
                        `fk_user`, 
                        `date_upload_document`
                    ) VALUES (
                        '" . $filename . ".pdf', 
                        " . $filesize . ", 
                        '" . $elements[2] . "', 
                        " . $_SESSION["client"] . ", 
                        '" . $_SESSION["printer"] . "', 
                        '" . date("Y-m-d H:i:s") . "'
                    )
                ;";
                
                if ($mysqli->query($query)) {        
                    if (copy($cave_path . $file, "../cache/" . $_SESSION["client"] . "/temp/" . $filename . ".pdf")) {
                        status(201);
                        write_log([
                            "libelle" => "UNCAVE document",
                            "admin" => 0,
                            "query" => $query,
                            "statut" => 0,
                            "message" => "",
                            "erreur" => "",
                            "document" => "",
                            "objet" => $filename
                        ]);
                        
                        array_push($documents, [
                            "filename": 
                        ])
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
                        "message" => "",
                        "erreur" => $mysqli->error,
                        "document" => "",
                        "objet" => $filename
                    ]);
                    $err = true;
                    break;
                }
	        
	            echo "########<br/>";
	            echo "Job : " . $elements[1] . "<br/>";
	            echo "File : " . $elements[2] . "<br/>";  
	        }
        }
    }
    
    if (!$err) {
        $json = '{ "status": "OK", "filename": "' . $filename . '.pdf" }';
        header('Content-Type: application/json');
        echo $json;
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
