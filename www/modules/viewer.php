<?php
session_start();

if (isset($_SESSION["user"])) {
    $filename = $_GET["document"];
    $display = $_GET["display"];
    $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    
    if ($extension == "pdf") {
#        echo $display;
#        echo urlencode("../../do/doUnpack.php?document=" . $filename . "&display=" . $display);
        header("Location: ../pdfjs/web/viewer.html?file=" . urlencode("../../do/doUnpack.php?document=" . $filename . "&display=" . $display . "&v=1"));
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
<link href='http://fonts.googleapis.com/css?family=Hammersmith+One' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="../css/viewer.css?v=3" media="screen" type="text/css"/>
<link rel="shortcut icon" type="image/ico" href="favicon.ico" />


</head>
<body>
    <?php
        $lien = "../do/doUnpack.php?document=" . $filename . "&display=" . $display . "&download";
        
        $img_extensions =  [
            "jpg",
            "png",
            "gif",
            "jpeg",
            "psd",
            "ai"
        ];

        if (in_array($extension, $img_extensions)) {
            $image = "../do/doUnpack.php?document=" . $filename . "&display=" . $display;
        ?>
                <img id="loader" src="../img/big_loader.gif"/>
                <a href="<?php echo $lien; ?>">
                    <img class="document-img" src="<?php echo $image; ?>"/>
                </a>
        <?php
        } else {
            if (isset($_GET["download"])) {
                header("Location: ../do/doUnpack.php?document=" . $filename . "&display=" . $display . "&download");
            } else {
                $image = "../img/dino_head.png";
            ?>
                    
                <a href="<?php echo $lien; ?>">
                    <img class="nopreview" src="<?php echo $image; ?>"/>
                    <p>
                        No hay previsualisacion por los archivos de tipo <b><?php echo $extension; ?></b>.<br/><br/>
                        Puedes descargar el archivo <pre><b><?php echo $display; ?></b></pre> dando click en el DINO.
                    </p>
                </a>
        
            <?php
            }        
        }
        ?>

<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
<script src="../js/viewer.js"></script>
<script type="text/javascript">
    $(".document-img").css({
        opacity: 0
    });
</script>
</body>
</html>
       
   <?php 
   }

} else {
    status(403);
}

?>
