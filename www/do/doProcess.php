<?php
session_start();
include("../includes/functions.php");

if ($_SESSION["niveau"] >= 10) {
    
    $client = $_SESSION["client"];
    $document = $_POST["document"];
    $extension = pathinfo($_FILES['document']['name'], PATHINFO_EXTENSION);
    $clef = $_SESSION["clef"];
    $action = $_POST["action"];
    $script = "";
    
    switch($action) {
        case "pack":
            $script = "packer";
            break;
        case "convert":
            $script = "converter";
            break;
        case "extract":
            if ($extension == "pdf") {
                $script = "pdfextractor";
            } else {
                $script = "loextractor";
            }
            break;
        case "remove":
            $script = "remove";
            break;
    }
    
    $descriptorspec = array(
       0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
       1 => array("pipe", "w"),  // stdout is a pipe that the child will write to
       2 => array("pipe", "w") // stderr is a file to write to
    );
    
    $cwd = NULL;
    $env = array();
    
    $commande = "../scripts/" . $script . ".sh " . $client . " " . $document . ' "' . $clef . '"';
    
    $process = proc_open($commande, $descriptorspec, $pipes, $cwd, $env);
    
    $commande_log = str_replace($clef, "%%CLEF%%", $commande);

    if (is_resource($process)) {
        // $pipes now looks like this:
        // 0 => writeable handle connected to child stdin
        // 1 => readable handle connected to child stdout
        // Any error output will be appended to /tmp/error-output.txt
        
        fclose($pipes[0]);
        
        $out = stream_get_contents($pipes[1]);
        fclose($pipes[1]);
        
        $err = stream_get_contents($pipes[2]);
        fclose($pipes[2]);

        // It is important that you close any pipes before calling
        // proc_close in order to avoid a deadlock
        $return_value = proc_close($process);

        $err_log = str_replace($clef, "%%CLEF%%", $err);

        if ($return_value == 0) {
            status(200);
            dino_log([
                "niveau" => "I",
                "message" => "PACK document",
                "query" => $commande_log
            ]);
        } else {
            status(500);
            dino_log([
                "niveau" => "E",
                "query" => $commande_log,
                "errno" => $return_value,
                "errinfo" => $err_log
            ]);
        }
    } else {
        status(500);
        dino_log([
            "niveau" => "E",
            "query" => $commande_log,
            "errno" => 666,
            "errinfo" => "Erreur inconnue"
        ]);
    }
} else {
    status(403);
    dino_log([
        "niveau" => "Z",
        "query" => "Pack : droits insuffisants"
    ]);
}
?>
