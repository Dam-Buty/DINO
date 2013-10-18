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
                    
                    $json_mondes .= '{ "pk": "' . $row_mondes["pk_monde"] . '", "label": "' . $row_mondes["label_monde"] . '", "cyclique": "' . $row_mondes["cyclique_monde"] . '", "champs": "%%CHAMPS%%", "categories": "%%CATEGORIES%%", "references": "%%REFERENCES%%" }';
                    
                    //////////////////////////
                    // Récupération des champs
                    //////////////////////////
                    $query_champs = "SELECT `pk_champ`, `label_champ`, `pluriel_champ` FROM `champ` AS `c` WHERE ( SELECT COUNT(*) FROM `monde_champ` WHERE `fk_client` = " . $row["fk_client"] . " AND `fk_monde` = " . $row_mondes["pk_monde"] . " AND `fk_champ` = `c`.`pk_champ` ) > 0";
                    
                    if ($result_champs = $mysqli->query($query_champs)) {
                        $json_champs = "[ ";
                        
                        while($row_champs = $result_champs->fetch_assoc()) {
                            if ($json_champs != "[ ") {
                                $json_champs .= ", ";
                            }
                            
                            $json_champs .= '{ "pk": "' . $row_champs["pk_champ"] . '", "label": "' . $row_champs["label_champ"] . '", "pluriel": "' . $row_champs["pluriel_champ"] . '", "liste": "%%LISTE%%" }';
                            
                            //////////////////////////
                            // Récupération des valeurs de champ sur lesquelles
                            // l'user a des droits
                            //////////////////////////
                            $query_liste = "SELECT `pk_valeur_champ`, `label_valeur_champ`, ( SELECT COUNT(*) FROM `user_valeur_champ` WHERE `fk_user` = '" . $_SESSION["user"] . "' AND `fk_champ` = " . $row_champs["pk_champ"] . " AND `fk_client` = " . $_SESSION["client"] . " AND  `vc`.`pk_valeur_champ` =  `fk_valeur_champ`) as `droits_valeur_champ` FROM `valeur_champ` AS `vc` WHERE `fk_champ` = " . $row_champs["pk_champ"] . " ORDER BY `droits_valeur_champ` DESC;";
                            
                            if ($result_liste = $mysqli->query($query_liste)) {
                                $json_liste = "[ ";
                                
                                while($row_liste = $result_liste->fetch_assoc()) {
                                    
                                    if ($_SESSION["niveau"] >= 20 or $row_liste["droits_valeur_champ"]) {
                                        if ($json_liste != "[ ") {
                                            $json_liste .= ", ";
                                        }
                                        
                                        $json_liste .= '{ "pk": "' . $row_liste["pk_valeur_champ"] . '", "label": "' . $row_liste["label_valeur_champ"] . '" }';
                                    }
                                } // FIN WHILE LISTE
                                
                                $json_liste .= " ]";
                                
                                $json_champs = str_replace('"%%LISTE%%"', $json_liste, $json_champs);
                                
                            } else {
                                status(500);
                                $json = '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query_champ . '" }';
                                break;
                            }
                        } // FIN WHILE CHAMPS
                        
                        $json_champs .= " ]";
                        
                        $json_mondes = str_replace('"%%CHAMPS%%"', $json_champs, $json_mondes);
                        
                    } else {
                        status(500);
                        $json = '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query_champ . '" }';
                        break;
                    }
                    
                    //////////////////////////
                    // Récupération des catégories sur lesquelles l'user a des droits
                    //////////////////////////
                    
                    $query_categories = "SELECT `pk_categorie_doc`, `label_categorie_doc` FROM `categorie_doc` WHERE `fk_client` = " . $_SESSION["client"] . " AND `fk_monde` = " . $row_mondes["pk_monde"] . " AND `niveau_categorie_doc` <= " . $_SESSION["niveau"] . ";";
                    
                    if ($result_categories = $mysqli->query($query_categories)) {
                        $json_categories = "[ ";
                        
                        while($row_categories = $result_categories->fetch_assoc()) {
                            if ($json_categories != "[ ") {
                                $json_categories .= ", ";
                            }
                            
                            $json_categories .= '{ "pk": "' . $row_categories["pk_categorie_doc"] . '", "label": "' . $row_categories["label_categorie_doc"] . '", "types": "%%TYPES%%" }';
                            
                            //////////////////////////
                            // Récupération des types de documents
                            //////////////////////////
                            $query_types = "SELECT `pk_type_doc`, `label_type_doc`, `detail_type_doc` FROM `type_doc` WHERE `fk_client` = " . $_SESSION["client"] . " AND `fk_monde` = " . $row_mondes["pk_monde"] . " AND `niveau_type_doc` <= " . $_SESSION["niveau"] . ";";
                            
                            if ($result_types = $mysqli->query($query_types)) {
                            
                                $json_types = "[ ";
                                
                                while($row_types = $result_types->fetch_assoc()) {
                                    if ($json_types != "[ ") {
                                        $json_types .= ", ";
                                    }
                                    
                                    $json_types .= '{ "pk": "' . $row_types["pk_type_doc"] . '", "label": "' . $row_types["label_type_doc"] . '", "detail": "' . $row_types["detail_type_doc"] . '" }';
                                } // FIN WHILE TYPES
                                
                                $json_types .= " ]";
                                
                                $json_categories = str_replace('"%%TYPES%%"', $json_types, $json_categories);
                                
                            } else {
                                status(500);
                                $json = '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query_champ . '" }';
                                break;
                            }
                        } // FIN WHILE CATEGORIES
                        
                        $json_categories .= " ]";
                        
                        $json_mondes = str_replace('"%%CATEGORIES%%"', $json_categories, $json_mondes);
                        
                    } else {
                        status(500);
                        $json = '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query_champ . '" }';
                        break;
                    }
                    
                    //////////////////////////
                    // Récupération des références d'opé
                    // Si l'utilisateur est > 20 il a droit à toutes les opération
                    // Sinon seulement celles qui ont des champs égaux aux siens
                    //////////////////////////
                    if ($row_mondes["cyclique_monde"]) {
                        if ($_SESSION["niveau"] >= 20) {
                            $query_references = "SELECT `pk_operation` AS `reference` FROM `operation` WHERE `fk_client` = " . $_SESSION["client"] . " AND `fk_monde` = " . $row_mondes["pk_monde"] . ";";
                        } else {
                            $query_references = "SELECT DISTINCT(`fk_operation`) AS `reference` FROM  `operation_valeur_champ` AS `ovc` , `valeur_champ` AS `vc` , `user_valeur_champ` AS `uvc` WHERE `ovc`.`fk_champ` = `vc`.`fk_champ` AND `ovc`.`fk_valeur_champ` = `vc`.`pk_valeur_champ` AND `vc`.`fk_champ` = `uvc`.`fk_champ` AND `vc`.`pk_valeur_champ` = `uvc`.`fk_valeur_champ` AND `fk_user` = '" . $_SESSION["user"] . "';";
                        }
                        
                        if ($result_references = $mysqli->query($query_references)) {
                            $json_references = "[ ";
                            
                            while($row_references = $result_references->fetch_assoc()) {
                                if ($json_references != "[ ") {
                                    $json_references .= ", ";
                                }
                                
                                $json_references .= '"' . $row_references["reference"] . '"';
                            }// FIN WHILE REFERENCES
                            
                            $json_references .= " ]";
                            
                            $json_mondes = str_replace('"%%REFERENCES%%"', $json_references, $json_mondes);
                        }
                    }
                } // FIN WHILE MONDES
                
                //////////////////////////
                // Finalisation du JSON
                // Envoi du statut OK (200)
                //////////////////////////                
                $json_mondes .= " ]";
                
                $json = str_replace('"%%MONDES%%"', $json_mondes, $json);
                
                status(200);
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
