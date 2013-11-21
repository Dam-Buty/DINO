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
    $types = [];
    
    $query_types = "SELECT `pk_type_doc`, `label_type_doc`, `detail_type_doc` FROM `type_doc` WHERE `fk_client` = " . $_SESSION["client"] . " AND `fk_monde` = " . $monde . " AND `fk_champ` = " . $champ . " AND `fk_categorie_doc` = " . $categorie . " AND `niveau_type_doc` <= " . $_SESSION["niveau"] . ";";
    
    if ($result_types = $mysqli->query($query_types)) {
        while($row_types = $result_types->fetch_assoc()) {
            
            $types[$row_types["pk_type_doc"]] = [
                "label" => $row_types["label_type_doc"],
                "detail" => $row_types["detail_type_doc"],
                "details" => []
            ];
            
            // Récupération des détails existants
            // pour les types de doc à détails
            if ($row_types["detail_type_doc"] == 1) {
                
                $query_details = "SELECT DISTINCT(`detail_type_doc`) FROM `type_doc_document` WHERE `fk_client` = " . $_SESSION["client"] . " AND `fk_monde` = " . $monde . " AND `fk_champ` = " . $champ . " AND `fk_categorie_doc` = " . $categorie . " AND `fk_type_doc` = " . $row_types["pk_type_doc"] . " ORDER BY `detail_type_doc`;";
                
                if ($result_details = $mysqli->query($query_details)) {
                    
                    while($row_details = $result_details->fetch_assoc()) {
                        array_push($types[$row_types["pk_type_doc"]], $row_details["detail_type_doc_document"]);
                    } // FIN WHILE DETAILS
                    
                } else {
                    status(500);
                    return '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query_details . '" }';
                }
            }
        } // FIN WHILE TYPES
        
        return $types;        
    } else {
        status(500);
        return '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query_types . '" }';
    }
}

function recupere_categories($monde, $champ, $mysqli) {    
    $categories = [];
    
    $query_categories = "SELECT `pk_categorie_doc`, `label_categorie_doc` FROM `categorie_doc` WHERE `fk_client` = " . $_SESSION["client"] . " AND `fk_monde` = " . $monde . " AND `fk_champ` = " . $champ . " AND `niveau_categorie_doc` <= " . $_SESSION["niveau"] . ";";

    if ($result_categories = $mysqli->query($query_categories)) {
        
        while($row_categories = $result_categories->fetch_assoc()) {
            
            $categories[$row_categories["pk_categorie_doc"]] = [
                "label" => $row_categories["label_categorie_doc"],
                "types" => []
            ];
            
            $categories[$row_categories["pk_categorie_doc"]]["types"] = recupere_types($monde, $champ, $row_categories["pk_categorie_doc"], $mysqli);
        } // FIN WHILE CATEGORIES
        
        return $categories;
        
    } else {
        status(500);
        return '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query_categories . '" }';
    }
}
  

if (isset($_SESSION["user"])) {
    include("../includes/mysqli.php");
    
    $maxFileSize = convertBytes( ini_get( 'upload_max_filesize' ) );
    
    $profil = [
        "maxfilesize" => $maxFileSize,
        "mondes" => []
    ];  
    
    ////////////////////////
    // Récupération des informations générales de l'user
    ////////////////////////
    $query = "SELECT `niveau_user`, `fk_client` FROM `user`, `client` WHERE `pk_client` = `fk_client` AND `login_user` = '" . $_SESSION["user"] . "';";
    
    if ($result = $mysqli->query($query)) {
        if ($row = $result->fetch_assoc()) {
            $_SESSION["niveau"] = $row["niveau_user"];
            $_SESSION["client"] = $row["fk_client"];
                        
            //////////////////////////
            // Récupération des mondes sur lesquels l'user a des droits
            //////////////////////////
            $query_mondes = "SELECT `pk_monde`, `label_monde` FROM `monde` WHERE `fk_client` = " . $row["fk_client"] . " AND `niveau_monde` <= " . $row["niveau_user"] . ";";
            
            if ($result_mondes = $mysqli->query($query_mondes)) {
                
                while($row_mondes = $result_mondes->fetch_assoc()) {
                    $profil["mondes"][$row_mondes["pk_monde"]] = [
                        "label" => $row_mondes["label_monde"],
                        "champs" => [],
                        "cascade" => [],
                        "references" => [
                            0 => []
                        ]
                    ];
                    
                    //////////////////////////
                    // Récupération des champs
                    //////////////////////////
                    $query_champs = "SELECT `pk_champ`, `label_champ`, `pluriel_champ` FROM `champ` WHERE `fk_client` = " . $_SESSION["client"] . " AND `fk_monde` = " . $row_mondes["pk_monde"] . " ORDER BY `pk_champ` ASC;";
                    
                    if ($result_champs = $mysqli->query($query_champs)) {
                        
                        while($row_champs = $result_champs->fetch_assoc()) {
                            $profil["mondes"][$row_mondes["pk_monde"]]["champs"][$row_champs["pk_champ"]] = [
                                "label" => $row_champs["label_champ"],
                                "pluriel" => $row_champs["pluriel_champ"],
                                "categories" => [],
                                "types" => [],
                                "liste" => []
                            ];
                            
                            array_push($profil["mondes"][$row_mondes["pk_monde"]]["cascade"], $row_champs["pk_champ"]);
                            
                            //////////////////////////
                            // Récupération des valeurs de champ sur lesquelles
                            // l'user a des droits
                            //////////////////////////
                            $query_liste = "
                                SELECT `pk_valeur_champ`, 
                                `label_valeur_champ`, 
                                `fk_parent`, ( 
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
                                ORDER BY 
                                    `droits_valeur_champ` DESC,
                                    `fk_parent` ASC
                                ;";
                            
                            if ($result_liste = $mysqli->query($query_liste)) {
                                
                                while($row_liste = $result_liste->fetch_assoc()) {
                                    
                                    if ($_SESSION["niveau"] >= 20 or $row_liste["droits_valeur_champ"]) {
                                    $profil["mondes"][$row_mondes["pk_monde"]]["champs"][$row_champs["pk_champ"]]["liste"][$row_liste["pk_valeur_champ"]] = $row_liste["label_valeur_champ"];
                                    
                                    // construction de la cascade de références
                                    $profil["mondes"][$row_mondes["pk_monde"]]["references"][$row_liste["fk_parent"]][$row_liste["pk_valeur_champ"]] = [];
                                    }
                                } // FIN WHILE LISTE
                            } else {
                                status(500);
                                $json = '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query_champ . '" }';
                                break;
                            }
                            
                            // Récupération des types de document en racine
                            $types = recupere_types($row_mondes["pk_monde"], $row_champs["pk_champ"], 0, $mysqli);
                            
                            $profil["mondes"][$row_mondes["pk_monde"]]["champs"][$row_champs["pk_champ"]]["types"] = $types;
                            
                            // Récupération des catégories/typedoc en racine
                            $categories = recupere_categories($row_mondes["pk_monde"], $row_champs["pk_champ"], $mysqli);
                            $profil["mondes"][$row_mondes["pk_monde"]]["champs"][$row_champs["pk_champ"]]["categories"] = $categories;
                            
                        } // FIN WHILE CHAMPS
                    } else {
                        status(500);
                        $json = '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query_champ . '" }';
                        break;
                    }
                    
                } // FIN WHILE MONDES
                
                status(200);
                $json = json_encode($profil);
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
