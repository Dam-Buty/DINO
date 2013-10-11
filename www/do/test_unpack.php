<?php
session_start();
header("Content-Type: text/plain");

if ($_SESSION["niveau"] > 10) {
    $client = $_SESSION["client"];
    $document = "bidule.pdf";
    $clef = $_SESSION["clef"];
    
    $descriptorspec = array(
       0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
       1 => array("pipe", "w"),  // stdout is a pipe that the child will write to
       2 => array("pipe", "w") // stderr is a file to write to
    );
    
    $cwd = NULL;
    $env = array();
    
    echo "CMD : \n";
    echo "../scripts/packer.sh " . $client . " " . $document . ' "' . $clef . '"';
    
    $process = proc_open("../scripts/packer.sh " . $client . " " . $document . ' "' . $clef . '"', $descriptorspec, $pipes, $cwd, $env);

    if (is_resource($process)) {
        // $pipes now looks like this:
        // 0 => writeable handle connected to child stdin
        // 1 => readable handle connected to child stdout
        // Any error output will be appended to /tmp/error-output.txt
        
        fclose($pipes[0]);
        
        echo "\nSTDOUT : \n";
        echo stream_get_contents($pipes[1]);
        fclose($pipes[1]);
        
        echo "\nSTDERR : \n";
        echo stream_get_contents($pipes[2]);
        fclose($pipes[2]);

        // It is important that you close any pipes before calling
        // proc_close in order to avoid a deadlock
        $return_value = proc_close($process);

        echo "command returned $return_value\n";
    }
    
    echo "\n\n" . $retour;
}
?>
