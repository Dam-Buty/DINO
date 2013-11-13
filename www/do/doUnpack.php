<?php
session_start();

if ($_SESSION["niveau"] > 10) {
    include("../includes/status.php");
    
    $client = $_SESSION["client"];
    $document = $_GET["document"];
    $clef = $_SESSION["clef"];
    
    $descriptorspec = array(
       0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
       1 => array("pipe", "w"),  // stdout is a pipe that the child will write to
       2 => array("pipe", "w") // stderr is a file to write to
    );
    
    $cwd = NULL;
    $env = array();
    
    echo $_POST["document"] . " : lmlm";
    
    $commande = "../scripts/unpacker.sh " . $client . " " . $document . ' "' . $clef . '"';
    
    $process = proc_open($commande, $descriptorspec, $pipes, $cwd, $env);

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

        if ($return_value == 0) {
            status(200);
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0"); 
            header("Pragma: public");
            header("Content-type: application/pdf");
            header("Content-Disposition: inline; filename=remplacer.pdf");
            header("Content-Transfer-Encoding: binary");
            header("Content-Length: " . strlen($out));
            header("Accept-Ranges: bytes");
            echo $out;
        } else {
            status(500);
            $json = '{ "error": "' . $return_value . '", "commande": "' . $commande . '", "message": "' . $err . '" }';
        }
    } else {
        status(500);
        $json = '{ "error": "unknown" }';
    }
}

header('Content-Type: application/json');
echo $json;
?>
