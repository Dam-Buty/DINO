<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

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

function recupere_types($monde, $champ, $categorie) {
    $types = [];
    
    $query_types = "
        SELECT 
            `pk_type_doc`, 
            `label_type_doc`, 
            `detail_type_doc`, 
            `niveau_type_doc`,
            `time_type_doc`
        FROM `type_doc` 
        WHERE 
            `fk_client` = :client
            AND `fk_monde` = :monde
            AND `fk_champ` = :champ
            AND `fk_categorie_doc` = :categorie
            AND `niveau_type_doc` <= :niveau;";
            
    $result_types = dino_query($query_types,[
        "client" => $_SESSION["client"],
        "monde" => $monde,
        "champ" => $champ,
        "categorie" => $categorie,
        "niveau" => $_SESSION["niveau"] 
    ]);
    
    if ($result_types["status"]) {
        foreach($result_types["result"] as $row_types) {
            
            $types[$row_types["pk_type_doc"]] = [
                "label" => $row_types["label_type_doc"],
                "detail" => $row_types["detail_type_doc"],
                "niveau" => $row_types["niveau_type_doc"],
                "time" => $row_types["time_type_doc"],
                "details" => []
            ];
            
            // Récupération des détails existants
            // pour les types de doc à détails
            if ($row_types["detail_type_doc"] == 1) {
                
                $query_details = "
                    SELECT DISTINCT(`detail_type_doc`) 
                    FROM `type_doc_document` 
                    WHERE 
                        `fk_client` = :client
                        AND `fk_monde` = :monde
                        AND `fk_champ` = :champ
                        AND `fk_categorie_doc` = :categorie
                        AND `fk_type_doc` = :type
                    ORDER BY `detail_type_doc`;";
                
                $result_details = dino_query($query_details,[
                    "client" => $_SESSION["client"],
                    "monde" => $monde,
                    "champ" => $champ,
                    "categorie" => $categorie,
                    "type" => $row_types["pk_type_doc"]
                ]);
                
                if ($result_details["status"]) {
                    foreach($result_details["result"] as $row_details) {
                        array_push($types[$row_types["pk_type_doc"]]["details"], $row_details["detail_type_doc"]);
                    } // FIN WHILE DETAILS
                    
                } else {
                    status(500);
                    write_log([
                        "libelle" => "GET details type doc",
                        "admin" => 0,
                        "query" => $query_details,
                        "statut" => 1,
                        "message" => $result["errinfo"][2],
                        "erreur" => $result["errno"],
                        "document" => "",
                        "objet" => $_SESSION["user"]
                    ]);
                }
            }
        } // FIN WHILE TYPES
        
        return $types;        
    } else {
        status(500);
        write_log([
            "libelle" => "GET types doc",
            "admin" => 0,
            "query" => $query_types,
            "statut" => 1,
            "message" => $result["errinfo"][2],
            "erreur" => $result["errno"],
            "document" => "",
            "objet" => $_SESSION["user"]
        ]);
    }
}

function recupere_categories($monde, $champ) {    
    $categories = [];
    
    $query_categories = "
        SELECT 
            `pk_categorie_doc`, 
            `label_categorie_doc`, 
            `niveau_categorie_doc`, 
            `time_categorie_doc` 
        FROM `categorie_doc` 
        WHERE 
            `fk_client` = :client
            AND `fk_monde` = :monde
            AND `fk_champ` = :champ
            AND `niveau_categorie_doc` <= :niveau ;";

    $result_categories = dino_query($query_categories,[
        "client" => $_SESSION["client"],
        "monde" => $monde,
        "champ" => $champ,
        "niveau" => $_SESSION["niveau"] 
    ]);
    
    if ($result_categories["status"]) {
        foreach($result_categories["result"] as $row_categories) {
            
            $categories[$row_categories["pk_categorie_doc"]] = [
                "label" => $row_categories["label_categorie_doc"],
                "niveau" => $row_categories["niveau_categorie_doc"],
                "time" => $row_categories["time_categorie_doc"],
                "types" => []
            ];
            
            $categories[$row_categories["pk_categorie_doc"]]["types"] = recupere_types($monde, $champ, $row_categories["pk_categorie_doc"]);
        } // FIN WHILE CATEGORIES
        
        return $categories;
        
    } else {
        status(500);
        write_log([
            "libelle" => "GET categories doc",
            "admin" => 0,
            "query" => $query_categories,
            "statut" => 1,
            "message" => $result["errinfo"][2],
            "erreur" => $result["errno"],
            "document" => "",
            "objet" => $_SESSION["user"]
        ]);
    }
}

function gestion_tutos($niveau) {
    $tutos = [ ];
    
    $query_tutos = "
        SELECT 
            `pk_tuto`, 
            `titre_tuto`, 
            `niveau_tuto`,
            ( 
                SELECT COUNT(*)
                FROM `user_tuto`
                WHERE
                    `fk_user` = :user
                    AND `fk_tuto` = `pk_tuto`
            ) AS `done`
        FROM `tuto`
        WHERE
            `niveau_tuto` <= :niveau
        ORDER BY
            `pk_tuto` ASC
    ";
    
    $result_tutos = dino_query($query_tutos,[
        "user" => $_SESSION["user"],
        "niveau" => $niveau
    ]);
    
    if ($result_tutos["status"]) {
        foreach($result_tutos["result"] as $row_tutos) {
            array_push($tutos, [
                "pk" => $row_tutos["pk_tuto"],
                "titre" => $row_tutos["titre_tuto"],
                "niveau" => $row_tutos["niveau_tuto"],
                "done" => $row_tutos["done"]
            ]);
        } // FIN WHILE TUTOS
        return $tutos;
        
    } else {
        status(500);
        write_log([
            "libelle" => "GET tutos",
            "admin" => 0,
            "query" => $query_tutos,
            "statut" => 1,
            "message" => $result_tutos["errinfo"][2],
            "erreur" => $result_tutos["errno"],
            "document" => "",
            "objet" => $_SESSION["user"]
        ]);
    }
}

function gestion_documentation($niveau) {
    $documentations = [ ];
    
    $query_documentations = "
        SELECT 
            `pk_documentation`, 
            `titre_documentation`, 
            `niveau_documentation`, 
            `url_documentation`
        FROM `documentation`
        WHERE
            `niveau_documentation` <= :niveau
        ORDER BY
            `pk_documentation` ASC
    ";
    
    $result_documentations = dino_query($query_documentations,[
        "niveau" => $niveau
    ]);
    
    if ($result_documentations["status"]) {
        foreach($result_documentations["result"] as $row_documentation) {
            array_push($documentations, [
                "pk" => $row_documentation["pk_documentation"],
                "titre" => $row_documentation["titre_documentation"],
                "niveau" => $row_documentation["niveau_documentation"],
                "url" => $row_documentation["url_documentation"]
            ]);
        } // FIN WHILE TUTOS
        return $documentations;
        
    } else {
        status(500);
        write_log([
            "libelle" => "GET documentations",
            "admin" => 0,
            "query" => $query_documentations,
            "statut" => 1,
            "message" => $result_documentations["errinfo"][2],
            "erreur" => $result_documentations["errno"],
            "document" => "",
            "objet" => $_SESSION["user"]
        ]);
    }
}
  

if (isset($_SESSION["user"])) {
    include("../includes/PDO.php");
    
    $maxFileSize = convertBytes( ini_get( 'upload_max_filesize' ) );
    
    $profil = [
        "maxfilesize" => $maxFileSize,
        "branded" => 0,
        "public" => 0,
        "client" => 0,
        "tutos" => [],
        "documentations" => [],
        "mondes" => []
    ];
    
    ////////////////////////
    // Récupération des informations générales de l'user
    ////////////////////////
    $query = "SELECT `niveau_user`, `public_user`, `fk_client`, `printer_client`, `entreprise_client`, `branded_client` FROM `user`, `client` WHERE `pk_client` = `fk_client` AND `login_user` = :login ;";
    
    $result = dino_query($query,[
        "login" => $_SESSION["user"]
    ]);
    
    if ($result["status"]) {
        if (count($result["result"]) > 0) {
            $row = $result["result"][0];
            
            $_SESSION["client"] = $row["fk_client"];
            $_SESSION["printer"] = $row["printer_client"];
            $_SESSION["nom_client"] = $row["entreprise_client"];
            
            $profil["client"] = $row["fk_client"];
            $profil["niveau"] = $row["niveau_user"];
            $profil["printer"] = $row["printer_client"];
            
            $profil["tutos"] = gestion_tutos($profil["niveau"]);
            $profil["documentations"] = gestion_documentation($profil["niveau"]);
            
            $profil["branded"] = $row["branded_client"];
            $profil["public"] = $row["public_user"];
               
            //////////////////////////
            // Récupération des mondes sur lesquels l'user a des droits
            //////////////////////////
            $query_mondes = "
                SELECT 
                    `pk_monde`, 
                    `label_monde`,
                    `niveau_monde`
                FROM `monde` AS `m`
                WHERE 
                    `fk_client` = :client
                    AND (
                        SELECT COUNT(*)
                        FROM `user_monde` AS `um`
                        WHERE 
                            `um`.`fk_client` = `m`.`fk_client`
                            AND `um`.`fk_user` = :user
                            AND `um`.`fk_monde` = `m`.`pk_monde`
                    );";
            
            
            $result_mondes = dino_query($query_mondes,[
                "client" => $row["fk_client"],
                "user" => $_SESSION["user"]
            ]);
            
            if ($result_mondes["status"]) {
                
                foreach($result_mondes["result"] as $row_mondes) {
                    $profil["mondes"][$row_mondes["pk_monde"]] = [
                        "label" => $row_mondes["label_monde"],
                        "niveau" => $row_mondes["niveau_monde"],
                        "all" => "bogus",
                        "champs" => [],
                        "cascade" => [],
                        "references" => [
                            0 => []
                        ]
                    ];
                    
                    //////////////////////////
                    // Récupération des champs
                    //////////////////////////
                    $query_champs = "SELECT `pk_champ`, `label_champ`, `pluriel_champ` FROM `champ` WHERE `fk_client` = :client AND `fk_monde` = :monde ORDER BY `pk_champ` ASC;";
                    
                    $result_champs = dino_query($query_champs,[
                        "client" => $_SESSION["client"],
                        "monde" => $row_mondes["pk_monde"]
                    ]);
                    
                    if ($result_champs["status"]) {
                        
                        foreach($result_champs["result"] as $row_champs) {
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
                            // Attention, pour les niveau 1 et + , il a accés à tout! TODO
                            //////////////////////////
                            $query_liste = "
                                SELECT `pk_valeur_champ`, 
                                    `label_valeur_champ`, 
                                    `fk_parent`, ( 
                                        SELECT COUNT(*) 
                                        FROM `user_valeur_champ` AS `uvc` 
                                        WHERE `uvc`.`fk_client` = :client
                                        AND `uvc`.`fk_monde` = :monde
                                        AND `uvc`.`fk_champ` = :champ
                                        AND `uvc`.`fk_user` = :user
                                        AND `uvc`.`fk_valeur_champ` = `vc`.`pk_valeur_champ`
                                    ) AS `droits_valeur_champ` 
                                FROM `valeur_champ` AS `vc` 
                                WHERE `fk_client` = :client1
                                    AND `fk_monde` = :monde1
                                    AND `fk_champ` = :champ1
                                ORDER BY 
                                    `droits_valeur_champ` DESC,
                                    `fk_parent` ASC
                                ;";
                              
                            $result_liste = dino_query($query_liste,[
                                "client" => $_SESSION["client"],
                                "monde" => $row_mondes["pk_monde"],
                                "champ" => $row_champs["pk_champ"],
                                "user" => $_SESSION["user"],
                                "client1" => $_SESSION["client"],
                                "monde1" => $row_mondes["pk_monde"],
                                "champ1" => $row_champs["pk_champ"]
                            ]);     
                            
                            $all = false;
                            $first = true;
                            
                            if ($result_liste["status"]) {
                                    
                                foreach($result_liste["result"] as $row_liste) {
                                    if ($first) {
                                        if ($row_liste["droits_valeur_champ"] == 0) {
                                            $all = true;
                                            if ($profil["mondes"][$row_mondes["pk_monde"]]["all"] == "bogus") {
                                                $profil["mondes"][$row_mondes["pk_monde"]]["all"] = true;   
                                            }
                                        } else {
                                            if ($profil["mondes"][$row_mondes["pk_monde"]]["all"] == "bogus") {
                                                $profil["mondes"][$row_mondes["pk_monde"]]["all"] = false;   
                                            }
                                        }
                                        $first = false;
                                    }
                                    
                                    if ($_SESSION["niveau"] >= 20 or $row_liste["droits_valeur_champ"] or $all) {
                                    $profil["mondes"][$row_mondes["pk_monde"]]["champs"][$row_champs["pk_champ"]]["liste"][$row_liste["pk_valeur_champ"]] = $row_liste["label_valeur_champ"];
                                    
                                    // construction de la cascade de références
                                    $profil["mondes"][$row_mondes["pk_monde"]]["references"][$row_liste["fk_parent"]][$row_liste["pk_valeur_champ"]] = [];
                                    }
                                } // FIN WHILE LISTE
                            } else {
                                status(500);
                                write_log([
                                    "libelle" => "GET valeurs champ",
                                    "admin" => 0,
                                    "query" => $query_liste,
                                    "statut" => 1,
                                    "message" => $result["errinfo"][2],
                                    "erreur" => $result["errno"],
                                    "document" => "",
                                    "objet" => $row_champs["pk_champ"]
                                ]);
                                break;
                            }
                            
                            // Récupération des types de document en racine
                            $types = recupere_types($row_mondes["pk_monde"], $row_champs["pk_champ"], 0);
                            
                            $profil["mondes"][$row_mondes["pk_monde"]]["champs"][$row_champs["pk_champ"]]["types"] = $types;
                            
                            // Récupération des catégories/typedoc en racine
                            $categories = recupere_categories($row_mondes["pk_monde"], $row_champs["pk_champ"]);
                            $profil["mondes"][$row_mondes["pk_monde"]]["champs"][$row_champs["pk_champ"]]["categories"] = $categories;
                            
                        } // FIN WHILE CHAMPS
                    } else {
                        status(500);
                        write_log([
                            "libelle" => "GET champs",
                            "admin" => 0,
                            "query" => $query_liste,
                            "statut" => 1,
                            "message" => $result["errinfo"][2],
                            "erreur" => $result["errno"],
                            "document" => "",
                            "objet" => $row_mondes["pk_monde"]
                        ]);
                        break;
                    }
                    
                } // FIN WHILE MONDES
                
                status(200);
                $json = json_encode($profil);
                
#                var_dump( json_last_error() );
##                var_dump( $profil );
#                var_dump( utf8_decode($profil) );
                header('Content-Type: application/json');
                echo $json;
            } else {
                status(500);
                write_log([
                    "libelle" => "GET mondes",
                    "admin" => 0,
                    "query" => $query_mondes,
                    "statut" => 1,
                    "message" => $result["errinfo"][2],
                    "erreur" => $result["errno"],
                    "document" => "",
                    "objet" => $_SESSION["user"]
                ]);
                break;
            }
        } else {
            status(403);
            write_log([
                "libelle" => "GET user",
                "admin" => 0,
                "query" => $query,
                "statut" => 1,
                "message" => "",
                "erreur" => "Incohérence Session/BDD",
                "document" => "",
                "objet" => $_SESSION["user"]
            ]);
        }
    } else {
        status(500);
        write_log([
            "libelle" => "GET user",
            "admin" => 0,
            "query" => $query,
            "statut" => 1,
            "message" => $result["errinfo"][2],
            "erreur" => $result["errno"],
            "document" => "",
            "objet" => $_SESSION["user"]
        ]);
    }
} else {
    status(403);
    write_log([
        "libelle" => "GET user",
        "admin" => 0,
        "query" => "",
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => ""
    ]);
}
?>
