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

function recupere_types($monde, $champ, $categorie, $mysqli) {
    //////////////////////////
    // Récupération des types de documents
    //////////////////////////
    $query_types = "SELECT `pk_type_doc`, `label_type_doc`, `detail_type_doc` FROM `type_doc` WHERE `fk_client` = " . $_SESSION["client"] . " AND `fk_monde` = " . $monde . " AND `fk_champ` = " . $champ . " AND `fk_categorie_doc` = " . $categorie . " AND `niveau_type_doc` <= " . $_SESSION["niveau"] . ";";
    
    if ($result_types = $mysqli->query($query_types)) {
    
        $json_types = "{ ";
        
        while($row_types = $result_types->fetch_assoc()) {
            if ($json_types != "{ ") {
                $json_types .= ", ";
            }
            
            $json_types .= '"' . $row_types["pk_type_doc"] . '": { "label": "' . $row_types["label_type_doc"] . '", "detail": "' . $row_types["detail_type_doc"] . '", "details": "%%DETAILS%%" }';
            
            $json_details = "[ ";
            
            // Récupération des détails existants
            // pour les types de doc à détails
            if ($row_types["detail_type_doc"] == 1) {
                
                $query_details = "SELECT DISTINCT(`detail_type_doc`) FROM `type_doc_document` WHERE `fk_client` = " . $_SESSION["client"] . " AND `fk_monde` = " . $monde . " AND `fk_champ` = " . $champ . " AND `fk_categorie_doc` = " . $categorie . " AND `fk_type_doc` = " . $row_types["pk_type_doc"] . " ORDER BY `detail_type_doc`;";
                
                if ($result_details = $mysqli->query($query_details)) {
                    
                    while($row_details = $result_details->fetch_assoc()) {
                        if ($json_details != "[ ") {
                            $json_details .= ", ";
                        }
                        
                        $json_details .= '"' . $row_details["detail_type_doc_document"] . '"';
                    } // FIN WHILE DETAILS
                    
                } else {
                    status(500);
                    return '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query_details . '" }';
                }
            }
            $json_details .= " ]";
            
            $json_types = str_replace('"%%DETAILS%%"', $json_details, $json_types);
        } // FIN WHILE TYPES
        
        $json_types .= " }";
        
        return $json_types;        
    } else {
        status(500);
        return '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query_types . '" }';
    }
}

function recupere_categories($monde, $champ, $mysqli) {
    //////////////////////////
    // Récupération des catégories sur lesquelles l'user a des droits
    //////////////////////////

    $query_categories = "SELECT `pk_categorie_doc`, `label_categorie_doc` FROM `categorie_doc` WHERE `fk_client` = " . $_SESSION["client"] . " AND `fk_monde` = " . $monde . " AND `fk_champ` = " . $champ . " AND `niveau_categorie_doc` <= " . $_SESSION["niveau"] . ";";

    if ($result_categories = $mysqli->query($query_categories)) {
        $json_categories = "{ ";
        
        while($row_categories = $result_categories->fetch_assoc()) {
            if ($json_categories != "{ ") {
                $json_categories .= ", ";
            }
            
            $json_categories .= '"' . $row_categories["pk_categorie_doc"] . '": { "label": "' . $row_categories["label_categorie_doc"] . '", "types": "%%TYPES%%" }';
            
            $json_types = recupere_types($monde, $champ, $row_categories["pk_categorie_doc"], $mysqli);
            
            $json_categories = str_replace('"%%TYPES%%"', $json_types, $json_categories);
        } // FIN WHILE CATEGORIES
        
        $json_categories .= " }";
        
        return $json_categories;
        
    } else {
        status(500);
        return '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query_categories . '" }';
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
            $query_mondes = "SELECT `pk_monde`, `label_monde` FROM `monde` WHERE `fk_client` = " . $row["fk_client"] . " AND `niveau_monde` <= " . $row["niveau_user"] . ";";
            
            if ($result_mondes = $mysqli->query($query_mondes)) {
                $json_mondes = "{ ";
                
                while($row_mondes = $result_mondes->fetch_assoc()) {
                    if ($json_mondes != "{ ") {
                        $json_mondes .= ", ";
                    }
                    
                    $json_mondes .= '"' . $row_mondes["pk_monde"] . '": { "label": "' . $row_mondes["label_monde"] . '", "champs": "%%CHAMPS%%", "cascade": "%%CASCADE%%" }';
                    
                    //////////////////////////
                    // Récupération des champs
                    //////////////////////////
                    $query_champs = "SELECT `pk_champ`, `label_champ`, `pluriel_champ` FROM `champ` WHERE `fk_client` = " . $_SESSION["client"] . " AND `fk_monde` = " . $row_mondes["pk_monde"] . " ORDER BY `pk_champ` ASC;";
                    
                    if ($result_champs = $mysqli->query($query_champs)) {
                        $json_champs = "{ ";
                        $json_cascade = '{ "champs": [ ';
                        $cascade = array();
                        
                        while($row_champs = $result_champs->fetch_assoc()) {
                            if ($json_champs != "{ ") {
                                $json_champs .= ", ";
                                $json_cascade .= ", ";
                            }
                            
                            $json_champs .= '"' . $row_champs["pk_champ"] . '": { "label": "' . $row_champs["label_champ"] . '", "pluriel": "' . $row_champs["pluriel_champ"] . '", "categories": "%%CATEGORIES%%", "types": "%%TYPES%%", "liste": "%%LISTE%%" }';
                            $json_cascade .= '"' . $row_champs["pk_champ"] . '"';
                            push_array($cascade, $row_champs["pk_champ"]);
                            
                            //////////////////////////
                            // Récupération des valeurs de champ sur lesquelles
                            // l'user a des droits
                            //////////////////////////
                            $query_liste = "
                                SELECT `pk_valeur_champ`, 
                                `label_valeur_champ`, ( 
                                    SELECT COUNT(*) 
                                    FROM `user_valeur_champ` AS `uvc` 
                                    WHERE `uvc`.`fk_client` = " . $_SESSION["client"] . " 
                                    AND `uvc`.`fk_monde` = " . $row_mondes["pk_monde"] . " 
                                    AND `uvc`.`fk_champ` = " . $row_champs["pk_champ"] . " 
                                    AND `uvc`.`fk_user` = '" . $_SESSION["user"] . "' 
                                    AND `uvc`.`fk_valeur_champ` = `vc`.`pk_valeur_champ`
                                ) 
                                AS `droits_valeur_champ` 
                                FROM `valeur_champ` AS `vc` 
                                WHERE `fk_client` = " . $_SESSION["client"] . " 
                                AND `fk_monde` = " . $row_mondes["pk_monde"] . " 
                                AND `fk_champ` = " . $row_champs["pk_champ"] . " 
                                ORDER BY `droits_valeur_champ` DESC;";
                            
                            if ($result_liste = $mysqli->query($query_liste)) {
                                $json_liste = "{ ";
                                
                                while($row_liste = $result_liste->fetch_assoc()) {
                                    
                                    if ($_SESSION["niveau"] >= 20 or $row_liste["droits_valeur_champ"]) {
                                        if ($json_liste != "{ ") {
                                            $json_liste .= ", ";
                                        }
                                        
                                        $json_liste .= '"' . $row_liste["pk_valeur_champ"] . '": "' . $row_liste["label_valeur_champ"] . '"';
                                    }
                                } // FIN WHILE LISTE
                                
                                $json_liste .= " }";
                                
                                $json_champs = str_replace('"%%LISTE%%"', $json_liste, $json_champs);
                                
                            } else {
                                status(500);
                                $json = '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query_champ . '" }';
                                break;
                            }
                            
                            // Récupération des types de document en racine
                            $json_types = recupere_types($row_mondes["pk_monde"], $row_champs["pk_champ"], 0, $mysqli);
                            $json_champs = str_replace('"%%TYPES%%"', $json_types, $json_champs);
                            
                            // Récupération des catégories/typedoc en racine
                            $json_categories = recupere_categories($row_mondes["pk_monde"], $row_champs["pk_champ"], $mysqli);
                            $json_champs = str_replace('"%%CATEGORIES%%"', $json_categories, $json_champs);
                            
                        } // FIN WHILE CHAMPS
                        
                        $json_champs .= " }";
                        $json_mondes = str_replace('"%%CHAMPS%%"', $json_champs, $json_mondes);
                        
                        //////////////////////////:
                        // Récupération des valeurs de champs en cascade
                        $json_cascade .= ' ], "valeurs": "%%VALEURS%%" }';
                        
                        $parent = 0;
                        
                        $query_valeurs = "
                                SELECT `vc`.`pk_valeur_champ`, ( 
                                    SELECT COUNT(*) 
                                    FROM `user_valeur_champ` AS `uvc` 
                                    WHERE `uvc`.`fk_client` = " . $_SESSION["client"] . " 
                                    AND `uvc`.`fk_monde` = " . $row_mondes["pk_monde"] . " 
                                    AND `uvc`.`fk_champ` = `vc`.`fk_champ` 
                                    AND `uvc`.`fk_user` = '" . $_SESSION["user"] . "' 
                                    AND `uvc`.`fk_valeur_champ` = `vc`.`pk_valeur_champ`
                                ) 
                                AS `droits_valeur_champ` 
                                FROM `valeur_champ` AS `vc` 
                                WHERE `vc`.`fk_client` = " . $_SESSION["client"] . " 
                                    AND `vc`.`fk_monde` = " . $row_mondes["pk_monde"] . " 
                                ORDER BY
                                    `droits_valeur_champ` DESC,
                                    `vc`.`fk_champ` ASC,
                                    `vc`.`fk_parent` ASC,
                                    `vc`.`pk_valeur_champ` ASC
                        ;";
                        
                        if ($result_valeurs = $mysqli->query($query_valeurs)) {
                            $json_valeurs = '{ %%0%% }';
                            $json_niveau = "{ ";
                            $champ_en_cours = "";
                            $niveau = 0;
                            
                            while($row_valeurs = $result_valeurs->fetch_assoc()) {
                                
                                if ($_SESSION["niveau"] >= 20 or $row_valeurs["droits_valeur_champ"]) {
                                    if ($champ_en_cours == "") {
                                        $champ_en_cours = $row_valeurs["fk_champ"];
                                    }
                                    
                                    if ($champ_en_cours != $row_valeurs["fk_champ"]) {
                                        // Stocker le niveau entier dans son parent 
                                        
                                    }
                                    
                                    if ($json_niveau != "{ ") {
                                        $json_niveau .= ", ";
                                    }
                                    
                                    // TODO : récupérer les valeurs de champs
                                    // hiérarchiquement
                                }
                            }
                        }
                        
                        
                        $json_mondes = str_replace('"%%CASCADE%%"', $json_cascade, $json_mondes);
                        
                    } else {
                        status(500);
                        $json = '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query_champ . '" }';
                        break;
                    }
                    
                } // FIN WHILE MONDES
                
                //////////////////////////
                // Finalisation du JSON
                // Envoi du statut OK (200)
                //////////////////////////                
                $json_mondes .= " }";
                
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
