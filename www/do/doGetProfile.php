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

if (isset($_SESSION["niveau"])) {
    include("../includes/mysqli.php");
    
    $maxFileSize = convertBytes( ini_get( 'upload_max_filesize' ) );
    
    ////////////////////////
    // Récupération des informations générales de l'user et du client
    ////////////////////////
    $query = "SELECT `pk_client`, `fk_interlocuteur`, `credit_client`, `fk_profil` FROM `user`, `client` WHERE `pk_client` = `fk_client` AND `login_user` = '" . $_SESSION["user"] . "';";
    
    if ($result = $mysqli->query($query)) {
        if ($row = $result->fetch_assoc()) {
            // Génération du JSON de base
            $json = '{ "status": "OK", "maxfilesize": "' . $maxFileSize . '", "credit": "' . $row["credit_client"] . '", "champs": "%%CHAMPS%%", "clients": "%%CLIENTS%%" }';
            
            //////////////////////////
            // Récupération des champs
            //////////////////////////
            $query_champs = "SELECT `label_champ` , `pluriel_champ` , `source_champ`, ( SELECT `valeur_champ` FROM `user_champ` WHERE `login_user` = '" . $login . "' AND `fk_champ` = `pk_champ` ) AS `valeur_user` FROM `champ` WHERE `fk_profil` = " . $row["fk_profil"] . ";";
            
            if ($result_champs = $mysqli->query($query_champs)) {
                $json_champs = "";
        
                while($row_champs = $result_champs->fetch_assoc()) {
                    if ($json_champs == "") {
                        $json_champs = "[ ";
                    } else {
                        $json_champs .= ", ";
                    }
                    
                    // Construction du JSON de base du champ
                    $json_champs .= '{ "label": "' . $row_champs["label_champ"] . '", "pluriel": "' . $row_champs["pluriel_champ"] . '", "valeur": "' . $row_champs["valeur_user"] . '", "liste": "%%LISTE%%" }';
                    
                    ///////////////////////////////
                    // Appel de la procédure stockée pour lister le champ
                    ///////////////////////////////
                    $query_champ = "CALL `" . $row_champs["source_champ"] . "`(" . $row["pk_client"] . ");";
                    
                    if ($mysqli->multi_query($query_champ)) {
                        if ($result_champ = $mysqli->store_result()) {
                            $json_liste = "[ ";
                            while ($row_champ = $result_champ->fetch_assoc()) {
                                if ($json_liste != "[ ") {
                                    $json_liste .= ", ";
                                }
                                
                                // Alimentation de la liste
                                $json_liste .= '{ "id": "' . $row_champ["id"] . '", "label": "' . $row_champ["label"] . '", "detail": "' . $row_champ["detail"] . '" }';
                            }
                            
                            $result_champ->free();
                            
                            // Nettoyage des résultats mysqli
                            while($mysqli->more_results() && $mysqli->next_result()) {
                                $extraResult = $mysqli->use_result();
                                if($extraResult instanceof mysqli_result){
                                    $extraResult->free();
                                }
                            }
                            
                            $json_liste .= " ]";
                            
                            $json_champs = str_replace('"%%LISTE%%"', $json_liste, $json_champs);
                            
                        } else {
                            status(500);
                            $json = '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query_champ . '" }';
                            break;
                        }
                    } else {
                        status(500);
                        $json = '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query_champ . '" }';
                        break;
                    }
                }
                
                $json_champs .= " ]";
                $json = str_replace('"%%CHAMPS%%"', $json_champs, $json);
                
                ////////////////////////
                // Gestion des clients
                // Les utilisateurs niveau 0 (clients) n'ont pas accès à la liste de clients
                ////////////////////////
                if ($row["niveau_user"] >= 10) {
                    $query_clients = "SELECT `num_interlocuteur`, `nom_interlocuteur` FROM `interlocuteur` WHERE `fk_client` = " . $row["pk_client"] . ";";
                    
                    $json_client = "";
                    
                    if ($result_clients = $mysqli->query($query_clients)) {
                        $json_client .= "[ ";
                        
                        while ($row_clients = $result_clients->fetch_assoc()) {
                            if ($json_client != "[ ") {
                                $json_client .= ", ";
                            }
                            
                            $json_client .= '{ "num": ' . $row_clients["num_interlocuteur"] . ', "nom": "' . $row_clients["nom_interlocuteur"] . '" }';
                        }
                        
                        $json_client .= " ]";
                        
                        $json = str_replace('"%%CLIENTS%%"', $json_client, $json);
                    } else {
                        status(500);
                        $json = '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query_clients . '" }';
                    }
                }
            } else {
                status(500);
                $json = '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query_champs . '" }';
            }
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
