<?php
session_start();
include("../includes/status.php");

function convertBytes( $value ) {
    if ( is_numeric( $value ) ) {
        return $value;
    } else {
        $value_length = strlen( $value );
        $qty = substr( $value, 0, $value_length - 1 );
        $unit = strtolower( substr( $value, $value_length - 1 ) );
        switch ( $unit ) {
            case 'k':
                $qty *= 1024;
                break;
            case 'm':
                $qty *= 1048576;
                break;
            case 'g':
                $qty *= 1073741824;
                break;
        }
        return $qty;
    }
}

if (isset($_SESSION["user"])) {
    include("../includes/mysqli.php");
    
    $maxFileSize = convertBytes( ini_get( 'upload_max_filesize' ) );
    
    ////////////////////////
    // Récupération des informations générales de l'user
    ////////////////////////
    $query = "SELECT `niveau_user`, `fk_client` FROM `user`, `client` WHERE `pk_client` = `fk_client` AND `login_user` = '" . $_SESSION["user"] . "';";
    
    if ($result = $mysqli->query($query)) {
        if ($row = $result->fetch_assoc()) {
            $_SESSION["niveau"] = $row["niveau_user"];
            $_SESSION["client"] = $row["fk_client"];
            
            // Génération du JSON de base
            $json = '{ "status": "OK", "maxfilesize": "' . $maxFileSize . '", "mondes": "%%MONDES%%" }';
            
            //////////////////////////
            // Récupération des mondes sur lesquels l'user a des droits
            //////////////////////////
            $query_mondes = "SELECT `pk_monde`, `label_monde`, `cyclique_monde` FROM `monde` WHERE `fk_client` = " . $row["fk_client"] . " AND `niveau_monde` <= " . $row["niveau_user"] . ";";
            
            if ($result_mondes = $mysqli->query($query_mondes)) {
                $json_mondes = "[ ";
                
                while($row_mondes = $result_mondes->fetch_assoc()) {
                    if ($json_mondes != "[ ") {
                        $json_mondes .= ", ";
                    }
                    
                    $json_mondes .= '{ "pk": "' . $row_mondes["pk_monde"] . '", "label": "' . $row_mondes["label_monde"] . '", "cyclique": "' . $row_mondes["cyclique_monde"] . '", "champs": "%%CHAMPS%%", "categories": "%%CATEGORIES%%" }';
                    
                    //////////////////////////
                    // Récupération des champs
                    //////////////////////////
                    $query_champs = "SELECT `pk_champ`, `label_champ`, `pluriel_champ`, ( SELECT COUNT(*) FROM `monde_champ` WHERE `fk_client` = " . $row["fk_client"] . " AND `fk_monde` = " . $row_mondes["pk_monde"] . " ) as `presence_champ` FROM `champ` WHERE `presence_champ` > 0";
                    
                    if ($result_champs = $mysqli->query($query_champs)) {
                        $json_champs = "[ ";
                        
                        while($row_champs = $result_champs->fetch_assoc()) {
                            if ($json_champs != "[ ") {
                                $json_champs .= ", ";
                            }
                            
                            $json_champs .= '{ "label": "' . $row_champs["label"] . '", "pluriel": "' . $row_champs["pluriel"] . '", "liste": "%%LISTE%%" }'
                            
                            //////////////////////////
                            // Récupération des valeurs de champ sur lesquelles
                            // l'user a des droits
                            //////////////////////////
                            $query_liste = "SELECT `pk_valeur_champ`, `label_valeur_champ`, ( SELECT COUNT(*) FROM `user_valeur_champ` WHERE `fk_user` = '" . $_SESSION["user"] . "' AND `fk_champ` = " . $row_champs["pk_champ"] . " AND `fk_client` = " . $_SESSION["client"] . " ) as `droits_valeur_champ` FROM `valeur_champ` WHERE `fk_champ` = " . $row_champs["pk_champ"] . " ORDER BY `droits_valeur_champ` DESC;";
                            
                            if ($result_liste = $mysqli->query($query_liste)) {
                                $full_rights = -1;
                                $json_liste = "[ ";
                                
                                while($row_liste = $result_liste->fetch_assoc()) {
                                    if ($full_rights == -1) {
                                        // Si la première valeur du champ n'a pas de droits, alors aucune n'en a, alor l'user a tous les droits
                                        if (!$row_liste["droits_valeur_champ"]) {
                                            $full_rights = 1;
                                        } else {
                                            $full_rights = 0;
                                        }
                                    }
                                    
                                    if ($full_rights or $row_liste["droits_valeur_champ"]) {
                                        if ($json_liste != "[ ") {
                                            $json_liste .= ", ";
                                        }
                                        
                                        $json_liste .= '{ "pk": "' . $row_liste["pk_valeur_champ"] . '", "label": "' . $row_liste["label_valeur_champ"] . '" }';
                                    }
                                } // FIN WHILE LISTE
                            } else {
                                status(500);
                                $json = '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query_champ . '" }';
                                break;
                            }
                        } // FIN WHILE CHAMPS
                    } else {
                        status(500);
                        $json = '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query_champ . '" }';
                        break;
                    }
                    
                    //////////////////////////
                    // Récupération des catégories sur lesquelles l'user a des droits
                    //////////////////////////
                    
                    $query_categories = "";
                } // FIN WHILE MONDES
            } else {
                status(500);
                $json = '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query_champ . '" }';
                break;
            }
        } else {
            status(500);
            $json = '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query . '" }';
        }
    } else {
        status(500);
        $json = '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query . '" }';
    }
    header('Content-Type: application/json');
    echo $json;
} else {
    status(403);
}
?>
