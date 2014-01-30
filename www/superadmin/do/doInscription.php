<?php
session_start();
if (isset($_SESSION["superadmin"])) {
    include("../../includes/PDO.php");
    include("../../includes/crypt.php");
    
    // Génération et cryptage de la clef de sécurité avec le login, le mdp et le mail_client
    
    $clef_user = custom_hash($_POST["login"] . $_POST["password"] . $_POST["mail"]);
    $clef_stockage = genere_clef(32);
    $clef_cryptee = crypte($clef_user, $clef_stockage);
    
    $password = custom_hash($_POST["password"] . $_POST["login"], TRUE);

#    echo "User : " . $clef_user . "<br/>";
#    echo "Clef : <pre>" . $clef_stockage . "</pre>";
    
    $query_client = "
        INSERT INTO `client` (
            `entreprise_client`, 
            `mail_client`, 
            `nom_contact_client`, 
            `poste_contact_client`, 
            `phone_contact_client`
        ) VALUES (
            :entreprise, 
            :mail, 
            :nom, 
            :poste, 
            :phone
    );";
    
    $result_client = dino_query($query_client,[
        "entreprise" => $_POST["entreprise"],
        "mail" => $_POST["mail"],
        "nom" => $_POST["nom_contact"],
        "poste" => $_POST["poste_contact"],
        "phone" => $_POST["phone_contact"]
    ]);
    
    if ($result_client["status"]) {
        $idclient = $result_client["result"];
        
        $query_user = "
            INSERT INTO `user` (
                `login_user`, 
                `mdp_user`, 
                `mail_user`, 
                `niveau_user`, 
                `fk_client`, 
                `clef_user`
            ) VALUES (
                :login, 
                :password, 
                :mail, 
                30, 
                :idclient, 
                :clef
        );";
        
        $result_user = dino_query($query_user,[
            "login" => $_POST["login"],
            "password" => $password,
            "mail" => $_POST["mail"],
            "idclient" => $idclient,
            "clef" => $clef_cryptee
        ]);
        
        if ($result_user["status"]) {
            chdir("../../cache/");
            mkdir($idclient);
            chdir($idclient);
            mkdir("temp");
            header("Location: ../index.php");
        } else {
            echo $query_user . "<br/>";
            echo $result_user["errinfo"][2];
        }
    } else {
        echo $query_client . "<br/>";
        echo $result_client["errinfo"][2];
    }
}
?>
