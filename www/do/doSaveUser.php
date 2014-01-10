<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

if (isset($_SESSION["niveau"]) && $_SESSION["niveau"] >= 20 && $_SESSION["niveau"] > $_POST["niveau"]) {
    include("../includes/mysqli.php");
    include("../includes/crypt.php");
    
    
    if ($_POST["pk"] == "new") {
        // Génération et cryptage de la clef de sécurité avec le login, le mdp et le mail_client
        
        $clef_user = custom_hash($_POST["login"] . $_POST["pass"] . $_POST["mail"]);
        $clef_stockage = $_SESSION["clef"];
        $clef_cryptee = crypte($clef_user, $clef_stockage);
        
        $password = custom_hash($_POST["pass"] . $_POST["login"], TRUE);

    #    echo "User : " . $clef_user . "<br/>";
    #    echo "Clef : <pre>" . $clef_stockage . "</pre>";
    
        $query = "
            INSERT INTO `user`
            (
                `login_user`, 
                `mdp_user`, 
                `mail_user`, 
                `niveau_user`, 
                `fk_client`, 
                `clef_user`
            ) VALUES (
                '" . $_POST["login"] . "', 
                '" . $password . "', 
                '" . $_POST["mail"] . "', 
                " . $_POST["niveau"] . ", 
                " . $_SESSION["client"] . ", 
                '" . $clef_cryptee . "'
            );";
    } else {
        $query = "
            UPDATE `user`
            SET
                `niveau_user` = " . $_POST["niveau"] . "
            WHERE `login_user` = '" . $_POST["pk"] . "'
        ;";
    }
        
    $query .= "
        DELETE FROM `user_monde`
            WHERE 
                `fk_client` = " . $_SESSION["client"] . "
                AND `fk_user` = '" . $_POST["login"] . "'
                AND (
                    ";
                    
    $first_droit = true;

    foreach($_POST["droits"] as $key => $monde) {
        if (!$first_droit) {
            $query .= "
                    OR ";
        } else {
            $first_droit = false;
        }
        $query .= "`fk_monde` = " . $monde . "";
    }
                    
                    
                    
         $query .=  "
                );";
    
    if (is_array($_POST["mondes"])) {
        foreach($_POST["mondes"] as $monde => $valeurs) {
            $query .= "
            INSERT INTO `user_monde`
            (`fk_client`, `fk_monde`, `fk_user`) 
            VALUES (
                " . $_SESSION["client"] . ",
                " . $monde . ",
                '" . $_POST["login"] . "'
            );
            ";
            
            $query .= "
                DELETE FROM `user_valeur_champ`
                WHERE 
                    `fk_client` = " . $_SESSION["client"] . "
                    AND `fk_monde` = " . $monde . "
                    AND `fk_champ` =  " . $valeurs["champ"] . "
                    AND `fk_user` = '" . $_POST["login"] . "';
            ";
            
            
            if (is_array($valeurs["valeurs"])) {
                foreach($valeurs["valeurs"] as $i => $valeur) {
                    $query .= "
                    INSERT INTO `user_valeur_champ`
                    (`fk_client`, `fk_monde`, `fk_champ`, `fk_user`, `fk_valeur_champ`) 
                    VALUES (
                        " . $_SESSION["client"] . ",
                        " . $monde . ",
                        " . $valeurs["champ"] . ",
                        '" . $_POST["login"] . "',
                        " . $valeur . "
                    );
                    ";
                }
            }
        }
    }
    
    if ($mysqli->multi_query($query)) {
        $i = 0; 
        do { 
            $i++; 
        } while ($mysqli->next_result()); 
        
        if (!$mysqli->errno) { 
            status(200);
            write_log([
                "libelle" => "INSERT user",
                "admin" => 1,
                "query" => $query,
                "statut" => 0,
                "message" => "",
                "erreur" => "",
                "document" => "",
                "objet" => $_POST["login"]
            ]);
        } else {
            status(500);
            write_log([
                "libelle" => "INSERT user",
                "admin" => 1,
                "query" => $query,
                "statut" => 1,
                "message" => "",
                "erreur" => $mysqli->error,
                "document" => "",
                "objet" => $_POST["login"]
            ]);
        }
    } else {
        status(500);
        write_log([
            "libelle" => "INSERT user",
            "admin" => 1,
            "query" => $query,
            "statut" => 1,
            "message" => "",
            "erreur" => $mysqli->error,
            "document" => "",
            "objet" => $_POST["login"]
        ]);
    }
    header('Content-Type: application/json');
    echo $json;
} else {
    status(403);
    write_log([
        "libelle" => "INSERT user",
        "admin" => 1,
        "query" => "",
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_POST["login"]
    ]);
}
?>
