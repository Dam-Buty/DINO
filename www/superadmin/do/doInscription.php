<?php
session_start();
if (isset($_SESSION["superadmin"])) {
    include("../../includes/mysqli.php");
    include("../../includes/crypt.php");
    
    // Génération et cryptage de la clef de sécurité avec le login, le mdp et le mail_client
    
    $clef_user = custom_hash($_POST["login"] . $_POST["password"] . $_POST["mail"]);
    $clef_stockage = genere_clef(32);
    $clef_cryptee = crypte($clef_user, $clef_stockage);
    
    $password = custom_hash($_POST["password"] . $_POST["login"], TRUE);

#    echo "User : " . $clef_user . "<br/>";
#    echo "Clef : <pre>" . $clef_stockage . "</pre>";
    
    $query_client = "INSERT INTO `client` (`entreprise_client`, `mail_client`, `nom_contact_client`, `poste_contact_client`, `phone_contact_client`, `bucket_client`, `credit_client`) VALUES ('" . $_POST["entreprise"] . "', '" . $_POST["mail"] . "', '" . $_POST["nom_contact"] . "', '" . $_POST["poste_contact"] . "', '" . $_POST["phone_contact"] . "', '" . $_POST["bucket"] . "', " . $_POST["credit"] . ");";
    
    if ($mysqli->query($query_client)) {
        $idclient = $mysqli->insert_id;
        $query_user = "INSERT INTO `user` (`login_user`, `mdp_user`, `mail_user`, `niveau_user`, `fk_client`, `clef_user`) VALUES ('" . $_POST["login"] . "', '" . $password . "', '" . $_POST["mail"] . "', 30, " . $idclient . ", '" . $clef_cryptee . "');";
        
        if ($mysqli->query($query_user)) {
            mkdir("../../cache/" + $idclient);
            mkdir("../../cache/" + $idclient + "/temp");
            header("Location: ../index.php");
        } else {
            echo $query_user . "<br/>";
            echo $mysqli->error;
        }
    } else {
        echo $query_client . "<br/>";
        echo $mysqli->error;
    }
}
?>
