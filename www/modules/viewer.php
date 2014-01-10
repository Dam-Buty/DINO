<?php
session_start();

if (isset($_SESSION["user"])) {
    $filename = $_GET["document"];
    $extension = pathinfo($filename, PATHINFO_EXTENSION);
    
    if ($extension == "pdf") {
        header("Location: ../pdfjs/viewer/viewer.html?file=" . urlencode("../../do/doUnpack.php?document=" . $filename));
    } else {
    ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" 
    "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es">
<head>
<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
<title>DINO</title>
<meta content="2013-02-28" name="date" />
<meta content="Damien BUTY" name="author" />
<meta content="La revolucion documental!" name="description" />
<link href='css/Oswald-Bold.ttf' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="../css/viewer.css?v=3" media="screen" type="text/css"/>
<link rel="shortcut icon" type="image/ico" href="favicon.ico" />


</head>
<body>
    <?php
        $lien = "../do/doUnpack.php?document=" . $filename . "&download";
        
        if ($extension == "jpg" || $extension == "gif" || $extension == "png") {
            $image = "../do/doUnpack.php?document=" . $filename;
        ?>
                <a href="<?php echo $lien; ?>">
                    <img class="document" src="<?php echo $image; ?>"/>
                </a>
    
        <?php
        } else {
            $image = "../img/dino_head.png";
        ?>
                
                <a href="<?php echo $lien; ?>">
                    <img class="nopreview" src="<?php echo $image; ?>"/>
                    <p>
                        No hay previsualisaion por los archivos de tipo <b><?php echo $extension; ?></b>.<br/><br/>
                        Puedes descargar el archivo <pre><b><?php echo $filename; ?></b></pre> dando click en el DINO.
                    </p>
                </a>
    
        <?php
        }
        ?>
     <a>

</body>
</html>
       
   <?php 
   }

} else {
    status(403);
    write_log([
        "libelle" => "INSERT valeur",
        "admin" => 1,
        "query" => $query,
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_POST["pk"]
    ]);
}

?>
