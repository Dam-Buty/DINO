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
    
    try {
        $result_types = $dino->query("profil_types",[
            "client" => $_SESSION["client"],
            "monde" => $monde,
            "champ" => $champ,
            "categorie" => $categorie,
            "niveau" => $_SESSION["niveau"] 
        ]);

        foreach($result_types as $row_types) {
            
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
                
                $query_details = "";
                
                $result_details = $dino->query("profil_type_details",[
                    "client" => $_SESSION["client"],
                    "monde" => $monde,
                    "champ" => $champ,
                    "categorie" => $categorie,
                    "type" => $row_types["pk_type_doc"]
                ]);
            
                foreach($result_details as $row_details) {
                    array_push($types[$row_types["pk_type_doc"]]["details"], $row_details["detail_type_doc"]);
                } // FIN WHILE DETAILS   
            }
        } // FIN WHILE TYPES

        return $types;  
    } catch (Exception $e) {
        throw new Exception("Erreur de recuperation recursive", 3);
    }
}

function recupere_categories($monde, $champ) {    
    $categories = [];
    
    try {
        $result_categories = $dino->query("profil_categories",[
            "client" => $_SESSION["client"],
            "monde" => $monde,
            "champ" => $champ,
            "niveau" => $_SESSION["niveau"] 
        ]);
        
        foreach($result_categories as $row_categories) {
            
            $categories[$row_categories["pk_categorie_doc"]] = [
                "label" => $row_categories["label_categorie_doc"],
                "niveau" => $row_categories["niveau_categorie_doc"],
                "time" => $row_categories["time_categorie_doc"],
                "types" => []
            ];
            
            $categories[$row_categories["pk_categorie_doc"]]["types"] = recupere_types($monde, $champ, $row_categories["pk_categorie_doc"]);
        } // FIN WHILE CATEGORIES
        
        return $categories;
    } catch (Exception $e) {
        throw new Exception("Erreur de recuperation recursive", 3);
    }
}

function gestion_tutos($niveau) {
    $tutos = [ ];
    
    try {
        $result_tutos = $dino->query("profil_tutos",[
            "user" => $_SESSION["user"],
            "niveau" => $niveau
        ]);
        
        foreach($result_tutos as $row_tutos) {
            array_push($tutos, [
                "pk" => $row_tutos["pk_tuto"],
                "titre" => $row_tutos["titre_tuto"],
                "niveau" => $row_tutos["niveau_tuto"],
                "done" => $row_tutos["done"]
            ]);
        } // FIN WHILE TUTOS
        return $tutos;
    } catch (Exception $e) {
        throw new Exception("Erreur de recuperation recursive", 3);
    }
}

function gestion_documentation($niveau) {
    $documentations = [ ];
    
    try {
        $result_documentations = $dino->query("profil_documentations",[
            "niveau" => $niveau
        ]);
        
        foreach($result_documentations as $row_documentation) {
            array_push($documentations, [
                "pk" => $row_documentation["pk_documentation"],
                "titre" => $row_documentation["titre_documentation"],
                "niveau" => $row_documentation["niveau_documentation"],
                "url" => $row_documentation["url_documentation"]
            ]);
        } // FIN WHILE TUTOS
        return $documentations;
    } catch (Exception $e) {
        throw new Exception("Erreur de recuperation recursive", 3);
    }
}

function gestion_tokens($niveau) {
    $tokens = [
        "espace" => 0,
        "visitor" => 0,
        "paid" => [
            "mondes" => [],
            "users" => []
        ],
        "unpaid" => [
            "mondes" => [],
            "users" => []
        ]
    ];
    
    try {
        $result_tokens = $dino->query("profil_tokens",[
            "client" => $_SESSION["client"]
        ]);
            
        // On parcourt les tokens :
        // - On ignore les expirés (SQL)
        // - On met dans la besace les valides pas utilisés
        // - On expire les éléments et les tokens qui viennent de passer leur validité
        // - On stocke dans le profil les options (visitors, espace...)
        
        foreach($result_tokens as $row_token) {
            $expired = $row_token["expired"];
            
            // Selon le produit
            switch($row_token["fk_produit"]) {
                case 1: //////////////////////// USERS
                    if (!$expired) {
                        if ($_SESSION["niveau"] >= 20) {
                            if ($row_token["used_token"] == 0) {
                                if ($row_token["paid_token"]) {
                                    // Met le token dans la besace du user
                                    array_push($tokens["paid"]["users"], $row_token["pk_token"]);
                                } else {
                                    array_push($tokens["unpaid"]["users"], $row_token["pk_token"]);
                                }
                            }
                        }
                    }
                    break;
                case 2: //////////////////////////// Visitors
                    if (!$expired) {
                        $tokens["visitor"] = $row_token["pk_token"];
                    }# else {
    #                        // Expire les visiteurs
    #                        $params_expire_visiteurs = [
    #                            "client" => $_SESSION["client"]
    #                        ];
    #                            
    #                        $result_expire_visiteurs = dino_query("expire_visiteurs", $params_expire_visiteurs);

    #                        if ($result_expire_visiteurs["status"]) {
    #                            $tokens["visitor"] = $result_expire_visiteurs * -1;
    #                        } else {
    #                            status(500);
    #                            $err = true;
    #                        }
    #                    }
                    break;
                case 3: /////////////////////////////// Espace
                    if (!$expired) {
                        $tokens["espace"] += $row_token["quantite_token"];
                    } else {
                        // Expirer l'espace en trop
                    }
                    break;
                case 4: //////////////////////////////////// Monde
    #                    if (!$expired) {
    #                        if ($niveau >= 30) {
    #                            if ($row_token["used_token"] == 0) {
    #                                if ($row_token["paid_token"]) {
    #                                    // Met le token dans la besace du user
    #                                    array_push($tokens["paid"]["mondes"], $row_token["pk_token"]);
    #                                } else {
    #                                    array_push($tokens["unpaid"]["mondes"], $row_token["pk_token"]);
    #                                }
    #                            }
    #                        }
    #                    } else {
    #                        if ($row_token["used_token"] != 0) {
    #                            // expire le monde concerné
    #                            $params_expire_monde = [
    #                                "pk" => $row_token["pk_token"]
    #                            ];
    #                            
    #                            $result_expire_monde = dino_query("expire_monde", $params_expire_monde);
    #    
    #                            if (!$result_expire_monde["status"]) {
    #                                status(500);
    #                                $err = true;
    #                            }
    #                        }
    #                    }
                    break;
            };
            
            // On expire le token le cas échéant
    #        if ($expired) {
    #            $params_expire_token = [
    #                "pk" => $row_token["pk_token"]
    #            ];
    #            
    #            $result_expire_token = dino_query("expire_token", $params_expire_token);
    #            if (!$result_expire_token["status"]) {
    #                status(500);
    #                $err = true;
    #            }
    #        }
        } // FIN WHILE TOKENS
        return $tokens;
    } catch (Exception $e) {
        throw new Exception("Erreur de recuperation recursive", 3);
    }
}
  
if (isset($_SESSION["user"])) {
    include("../includes/DINOSQL.php");
    
    $maxFileSize = convertBytes( ini_get( 'upload_max_filesize' ) );
    
    try {
        $dino = new DINOSQL();
        
        $profil = [
            "maxfilesize" => $maxFileSize,
            "branded" => 0,
            "public" => 0,
            "client" => 0,
            "convert" => 0,
            "espace" => 0,
            "visitor" => 0,
            "tutos" => [],
            "documentations" => [],
            "mondes" => []
        ];
        
        ////////////////////////
        // Récupération des informations générales de l'user
        ////////////////////////
        
        $result = $dino->query("profil_client_user",[
            "login" => $_SESSION["user"]
        ]);
        
        if (count($result) > 0) {
            $row = $result[0];
            
            $_SESSION["client"] = $row["fk_client"];
            $_SESSION["printer"] = $row["printer_client"];
            $_SESSION["nom_client"] = $row["entreprise_client"];
            
            $profil["client"] = $row["fk_client"];
            $profil["niveau"] = $row["niveau_user"];
            $profil["printer"] = $row["printer_client"];
            $profil["branded"] = $row["branded_client"];
            $profil["public"] = $row["public_user"];
            
            $profil["tutos"] = gestion_tutos($dino, $profil["niveau"]);
            $profil["documentations"] = gestion_documentation($dino, $profil["niveau"]);
            
            $profil["branded"] = $row["branded_client"];
            $profil["convert"] = $row["convert_client"];
            $profil["public"] = $row["public_user"];
            
            $profil["tokens"] = gestion_tokens($dino, $profil["niveau"]);
            
               
            //////////////////////////
            // Récupération des mondes sur lesquels l'user a des droits
            //////////////////////////
            
            $result_mondes = $dino->query("profil_mondes",[
                "client" => $row["fk_client"],
                "user" => $_SESSION["user"]
            ]);
                
            foreach($result_mondes as $row_mondes) {
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
                
                $result_champs = $dino->query("profil_champs",[
                    "client" => $_SESSION["client"],
                    "monde" => $row_mondes["pk_monde"]
                ]);
                    
                foreach($result_champs as $row_champs) {
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
                      
                    $result_liste = $dino->query("profil_valeurs",[
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
                            
                    foreach($result_liste as $row_liste) {
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
                    
                    // Récupération des types de document en racine
                    $types = recupere_types($dino, $row_mondes["pk_monde"], $row_champs["pk_champ"], 0);
                    
                    $profil["mondes"][$row_mondes["pk_monde"]]["champs"][$row_champs["pk_champ"]]["types"] = $types;
                    
                    // Récupération des catégories/typedoc en racine
                    $categories = recupere_categories($dino, $row_mondes["pk_monde"], $row_champs["pk_champ"]);
                    $profil["mondes"][$row_mondes["pk_monde"]]["champs"][$row_champs["pk_champ"]]["categories"] = $categories;
                    
                } // FIN WHILE CHAMPS
                
            } // FIN WHILE MONDES
            
            dino->commit();
            status(200);
            $json = json_encode($profil);
            header('Content-Type: application/json');
            echo $json;
        } else {
            status(403);
        }
    } catch (Exception $e) {
        $dino->rollback();
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Profil : pas de session pour cet user"
    ]);
    status(403);
}
?>
