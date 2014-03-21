<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

function total_query($query, $params) {
    $result = dino_query($query, $params);
    
    if ($result["status"]) {
        write_log([
            "libelle" => "TOTAL query",
            "admin" => 1,
            "query" => $query,
            "statut" => 0,
            "message" => "",
            "erreur" => "",
            "document" => "",
            "objet" => $objet
        ]);
        return true;
    } else {
        write_log([
            "libelle" => "TOTAL query",
            "admin" => 1,
            "query" => $query,
            "statut" => 1,
            "message" => $result["errinfo"][2],
            "erreur" => $result["errno"],
            "document" => "",
            "objet" => $_POST["pk"]
        ]);
        return false;
    }
}

function delete_type($champ, $categorie, $pk) {    
    $params_base = [
        "client" => $_SESSION["client"],
        "monde" => $_POST["pk"],
        "champ" => $champ,
        "categorie" => $categorie,
        "pk" => $pk
    ];
    
    $params_null_docs = $params_base;
    unset($params_null_docs["client"]);
    $params_null_docs = array_merge($params_null_docs, [
        "client1" => $_SESSION["client"],
        "client2" => $_SESSION["client"]
    ]);
    
    // Déclassifie les documents
    // - met à NULL le niveau et la date
    $query_null_docs = "
        UPDATE `document`
        SET
            `niveau_document` = NULL,
            `date_document` = NULL
        WHERE
            `fk_client` = :client1
            AND (
                SELECT COUNT(`fk_document`)
                FROM `type_doc_document`
                WHERE
                    `fk_client` = :client2
                    AND `fk_monde` = :monde
                    AND `fk_champ` = :champ
                    AND `fk_categorie_doc` = :categorie
                    AND `fk_type_doc` = :pk
                    AND `fk_document` = `filename_document`
            ) > 0
    ;";
    
    // - DELETE les liens avec des valeurs de champs
    
    $params_del_doc_val = $params_base;
    unset($params_del_doc_val["client"]);
    unset($params_del_doc_val["monde"]);
    $params_del_doc_val = array_merge($params_del_doc_val, [
        "client1" => $_SESSION["client"],
        "client2" => $_SESSION["client"],
        "monde1" => $_POST["pk"],
        "monde2" => $_POST["pk"]
    ]);
    
    $query_del_doc_val = "
        DELETE  `dvc` 
        FROM  `document_valeur_champ` AS  `dvc` 
        WHERE
            `dvc`.`fk_client` = :client1
            AND `dvc`.`fk_monde` = :monde1
            AND (
                SELECT COUNT(`tdd`.`fk_document`)
                FROM `type_doc_document` AS `tdd`
                WHERE
                    `tdd`.`fk_client` = :client2
                    AND `tdd`.`fk_monde` = :monde2
                    AND `tdd`.`fk_champ` = :champ
                    AND `tdd`.`fk_categorie_doc` = :categorie
                    AND `tdd`.`fk_type_doc` = :pk
                    AND `tdd`.`fk_document` = `dvc`.`fk_document`
            ) > 0
    ;";
    
    // - Suppression des associations à ce type de doc
    $params_del_doc_type = $params_base;
    
    $query_del_doc_type = "
        DELETE FROM `type_doc_document`
        WHERE
            `fk_client` = :client
            AND `fk_monde` = :monde
            AND `fk_champ` = :champ
            AND `fk_categorie_doc` = :categorie
            AND `fk_type_doc` = :pk
    ;";
    
    // Suppression du type de doc
    $params_del_type = $params_base;
    
    $query_del_type = "
        DELETE FROM `type_doc`
        WHERE
            `fk_client` = :client
            AND `fk_monde` = :monde
            AND `fk_champ` = :champ
            AND `fk_categorie_doc` = :categorie
            AND `pk_type_doc` = :pk
    ;";
    
#    var_dump($params_null_docs);
#    var_dump($query_null_docs);
    if (total_query($query_null_docs, $params_null_docs)) {
        if (total_query($query_del_doc_val, $params_del_doc_val)) {
            if (total_query($query_del_doc_type, $params_del_doc_type)) {
                if (total_query($query_del_type, $params_del_type)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function delete_categorie($champ, $pk) {
    $params_base = [
        "client" => $_SESSION["client"],
        "monde" => $_POST["pk"],
        "champ" => $champ,
        "pk" => $pk
    ];
    
    // SELECT tous les types de documents concernés
    $params_sel_types = $params_base;
    
    $query_sel_types = "
        SELECT `pk_type_doc`
        FROM `type_doc`
        WHERE
            `fk_client` = :client
            AND `fk_monde` = :monde
            AND `fk_champ` = :champ
            AND `fk_categorie_doc` = :pk
    ;";
    
    // DELETE LA CATEGORIE
    $params_del_cat = $params_base;
    
    $query_del_cat = "
        DELETE FROM `categorie_doc`
        WHERE
            `fk_client` = :client
            AND `fk_monde` = :monde
            AND `fk_champ` = :champ
            AND `pk_categorie_doc` = :pk
    ;";
    
    $result_sel_types = dino_query($query_sel_types, $params_sel_types);
    
    $err = false;
    
    if ($result_sel_types["status"]) {
        
        foreach($result_sel_types["result"] as $row) {
            if (!delete_type($champ, $pk, $row["pk_type_doc"])) {
                $err = true;
                break;
            }
        }
        
        if (!$err) {
            if (!total_query($query_del_cat, $params_del_cat)) {
                $err = true;
            }
        }
    } else {
        $err = true;
    }
    
    return !$err;
}

function delete_champ($pk) {
    $params_base = [
        "client" => $_SESSION["client"],
        "monde" => $_POST["pk"],
        "champ" => $pk
    ];
    
    // SELECT les categories
    $params_sel_cat = $params_base;
    
    $query_sel_cat = "
        SELECT `pk_categorie_doc`
        FROM `categorie_doc`
        WHERE
            `fk_client` = :client
            AND `fk_monde` = :monde
            AND `fk_champ` = :champ
    ;";
    
    // SELECT les types en racine
    $params_sel_types = $params_base;
    
    $query_sel_types = "
        SELECT `pk_type_doc`
        FROM `type_doc`
        WHERE
            `fk_client` = :client
            AND `fk_monde` = :monde
            AND `fk_champ` = :champ
            AND `fk_categorie_doc` = 0
    ;";
    
    // DELETE les valeurs de champ
    $params_del_val = $params_base;
    
    $query_del_val = "
        DELETE FROM `valeur_champ`
        WHERE
            `fk_client` = :client
            AND `fk_monde` = :monde
            AND `fk_champ` = :champ
    ;";
    
    // DELETE le champ
    $params_del_champ = $params_base;
    
    $query_del_champ = "
        DELETE FROM `champ`
        WHERE
            `fk_client` = :client
            AND `fk_monde` = :monde
            AND `pk_champ` = :champ
    ;";
    
    $result_sel_cat = dino_query($query_sel_cat, $params_sel_cat);
    
    $err = false;
    
    // Suppression des types 
    $result_sel_types = dino_query($query_sel_types, $params_sel_types);
    
    if ($result_sel_types["status"]) {
        
        foreach($result_sel_types["result"] as $row) {
            if (!delete_type($pk, 0, $row["pk_type_doc"])) {
                $err = true;
                break;
            }
        }
    } else {
        $err = true;
    }   
    
    // Suppression des catégories   
    if (!$err) {
        if ($result_sel_cat["status"]) {
            foreach($result_sel_cat["result"] as $row) {
                if (!delete_categorie($pk, $row["pk_categorie_doc"])) {
                    $err = true;
                    break;
                }
            }
        } else {
            $err = true;
        }
    } else {
        return false;
    }
    
    // Suppression des valeurs de champ et du champ
    if (!$err) {
        if (total_query($query_del_val, $params_del_val)) {
            if (total_query($query_del_champ, $params_del_champ)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

if ($_SESSION["niveau"] >= 30) {
    include("../includes/PDO.php");
    
    $params = [
        "client" => $_SESSION["client"],
        "label" => $_POST["label"]
    ];
    
    if (!isset($_POST["pk"])) {
        $query = "
            INSERT INTO `monde` (
                `label_monde`,
                `fk_client`
            ) VALUES (
                :label,
                :client
            )
        ;";
    } else {
        $query = "
            UPDATE `monde`
            SET `label_monde` = :label
            WHERE 
                `fk_client` = :client
                AND `pk_monde` = :pk
        ;";
        $params["pk"] = $_POST["pk"];
    }
      
    $result = dino_query($query,$params);  
    
    if ($result["status"]) {
        $err = false;
        
        if (!isset($_POST["pk"])) {
            $pk_monde = $result["result"];
        } else {
            $pk_monde = $_POST["pk"];
        }
    
        foreach($_POST["champs"] as $i => $champ) {
            $params_champ = [
                "client" => $_SESSION["client"],
                "monde" => $pk_monde,
                "label" => $champ["label"],
                "pluriel" => $champ["pluriel"]
            ];
            
            if (!isset($champ["pk"])) {
                $query_champ = "
                    INSERT INTO `champ` (
                        `label_champ`,
                        `pluriel_champ`,
                        `fk_monde`,
                        `fk_client`
                    ) VALUES (
                        :label,
                        :pluriel,
                        :monde,
                        :client
                    )
                ;";    
            } else {
                $query_champ = "
                    UPDATE `champ`
                    SET
                        `label_champ` = :label,
                        `pluriel_champ` = :pluriel
                    WHERE
                        `fk_client` = :client
                        AND `fk_monde` = :monde
                        AND `pk_champ` = :pk
                ;";
                
                $params_champ["pk"] = $champ["pk"];
            }
      
            $result_champ = dino_query($query_champ,$params_champ);
    
            if ($result_champ["status"]) {
                
                if (!isset($champ["pk"])) {
                    $pk_champ = $result_champ["result"];
                } else {
                    $pk_champ = $champ["pk"];
                }
                
                if (isset($champ["types"])) {
                    foreach($champ["types"] as $j => $type) {
                        if ($type["detail"] == "true") {
                            $type_detail = 1;
                        } else {
                            $type_detail = 0;
                        }
                        
                        if ($type["time"] == "true") {
                            $type_time = 1;
                        } else {
                            $type_time = 0;
                        }
                    
                        $params_type = [
                            "client" => $_SESSION["client"],
                            "monde" => $pk_monde,
                            "champ" => $pk_champ,
                            "label" => $type["label"],
                            "detail" => $type_detail,
                            "time" => $type_time,
                            "niveau" => $type["niveau"]
                        ];
                        
                        if (!isset($type["pk"])) {
                            $query_type = "
                                INSERT INTO `type_doc` (
                                    `label_type_doc`,
                                    `detail_type_doc`,
                                    `niveau_type_doc`,
                                    `time_type_doc`,
                                    `fk_categorie_doc`,
                                    `fk_champ`,
                                    `fk_monde`,
                                    `fk_client`
                                ) VALUES (
                                    :label,
                                    :detail,
                                    :niveau,
                                    :time,
                                    0,
                                    :champ,
                                    :monde,
                                    :client
                                )
                            ;";
                        } else {
                            $query_type = "
                                UPDATE `type_doc`
                                SET
                                    `label_type_doc` = :label,
                                    `detail_type_doc` = :detail,
                                    `niveau_type_doc` = :niveau,
                                    `time_type_doc` = :time
                                WHERE
                                    `fk_client` = :client
                                    AND `fk_monde` = :monde
                                    AND `fk_champ` = :champ
                                    AND `fk_categorie_doc` = 0
                                    AND `pk_type_doc` = :pk
                            ";
                            $params_type["pk"] = $type["pk"];
                        }
                        
                        $result_type = dino_query($query_type,$params_type);
        
                        if (!$result_type["status"]) {
                            write_log([
                                "libelle" => "INSERT Type",
                                "admin" => 1,
                                "query" => $query_type,
                                "statut" => 1,
                                "message" => $result_type["errinfo"][2],
                                "erreur" => $result_type["errno"],
                                "document" => "",
                                "objet" => $_POST["pk"]
                            ]);
                            $err = true;
                            break;
                        }
                    } // FIN WHILE TYPES
                }
                
                if (isset($champ["categories"])) {
                    foreach($champ["categories"] as $j => $categorie) {                    
                        $params_categorie = [
                            "client" => $_SESSION["client"],
                            "monde" => $pk_monde,
                            "champ" => $pk_champ,
                            "label" => $categorie["label"],
                            "niveau" => $categorie["niveau"]
                        ];
                        
                        if (!isset($categorie["pk"])) {
                            $query_categorie = "
                                INSERT INTO `categorie_doc` (
                                    `label_categorie_doc`,
                                    `niveau_categorie_doc`,
                                    `fk_champ`,
                                    `fk_monde`,
                                    `fk_client`
                                ) VALUES (
                                    :label,
                                    :niveau,
                                    :champ,
                                    :monde,
                                    :client
                                )
                            ;";
                        } else {
                            $query_categorie = "
                                UPDATE `categorie_doc`
                                SET
                                    `label_categorie_doc` = :label,
                                    `niveau_categorie_doc` = :niveau
                                WHERE
                                    `fk_client` = :client
                                    AND `fk_monde` = :monde
                                    AND `fk_champ` = :champ
                                    AND `pk_categorie_doc` = :pk
                            ";
                            $params_categorie["pk"] = $categorie["pk"];
                        }
          
                        $result_categorie = dino_query($query_categorie, $params_categorie);
                
                        if ($result_categorie["status"]) {
                            
                            if (!isset($categorie["pk"])) {
                                $pk_categorie = $result_categorie["result"];
                            } else {
                                $pk_categorie = $categorie["pk"];
                            }
                            
                            foreach($categorie["types"] as $k => $type) {
                                if ($type["detail"] == "true") {
                                    $type_detail = 1;
                                } else {
                                    $type_detail = 0;
                                }
                                
                                if ($type["time"] == "true") {
                                    $type_time = 1;
                                } else {
                                    $type_time = 0;
                                }
                                
                                $params_type = [
                                    "client" => $_SESSION["client"],
                                    "monde" => $pk_monde,
                                    "champ" => $pk_champ,
                                    "categorie" => $pk_categorie,
                                    "label" => $type["label"],
                                    "detail" => $type_detail,
                                    "time" => $type_time,
                                    "niveau" => $type["niveau"]
                                ];
                                
                                if (!isset($type["pk"])) {
                                    $query_type = "
                                        INSERT INTO `type_doc` (
                                            `label_type_doc`,
                                            `detail_type_doc`,
                                            `niveau_type_doc`,
                                            `time_type_doc`,
                                            `fk_categorie_doc`,
                                            `fk_champ`,
                                            `fk_monde`,
                                            `fk_client`
                                        ) VALUES (
                                            :label,
                                            :detail,
                                            :niveau,
                                            :time,
                                            :categorie,
                                            :champ,
                                            :monde,
                                            :client
                                        )
                                    ;";
                                } else {
                                    $query_type = "
                                        UPDATE `type_doc`
                                        SET
                                            `label_type_doc` = :label,
                                            `detail_type_doc` = :detail,
                                            `niveau_type_doc` = :niveau,
                                            `time_type_doc` = :time
                                        WHERE
                                            `fk_client` = :client
                                            AND `fk_monde` = :monde
                                            AND `fk_champ` = :champ
                                            AND `fk_categorie_doc` = :categorie
                                            AND `pk_type_doc` = :pk
                                    ";
                                    $params_type["pk"] = $type["pk"];
                                }
                                
                                $result_type = dino_query($query_type,$params_type);
                
                                if (!$result_type["status"]) {
                                    write_log([
                                        "libelle" => "INSERT Type dans catégorie",
                                        "admin" => 1,
                                        "query" => $query_type,
                                        "statut" => 1,
                                        "message" => $result_type["errinfo"][2],
                                        "erreur" => $result_type["errno"],
                                        "document" => "",
                                        "objet" => $_POST["pk"]
                                    ]);
                                    $err = true;
                                    break;
                                }
                            } // FIN WHILE TYPES
                            
                        } else {
                            write_log([
                                "libelle" => "INSERT Categorie",
                                "admin" => 1,
                                "query" => $query_categorie,
                                "statut" => 1,
                                "message" => $result_categorie["errinfo"][2],
                                "erreur" => $result_categorie["errno"],
                                "document" => "",
                                "objet" => $_POST["pk"]
                            ]);
                            $err = true;
                            break;
                        }
                        
                    } // FIN WHILE CATEGORIES
                }
            } else {
                write_log([
                    "libelle" => "INSERT Champ",
                    "admin" => 1,
                    "query" => $query_champ,
                    "statut" => 1,
                    "message" => $result_champ["errinfo"][2],
                    "erreur" => $result_champ["errno"],
                    "document" => "",
                    "objet" => $_POST["pk"]
                ]);
                $err = true;
                break;
            }
        } // FIN WHILE CHAMPS
        
        if (!isset($_POST["pk"])) {
            // Injection des droits pour le créateur et les gérants
            $params_select_droits = [
                "client" => $_SESSION["client"],
                "login" => $_SESSION["user"]
            ];
            
            $query_select_droits = "
                SELECT `login_user`
                FROM `user`
                WHERE
                    `fk_client` = :client
                    AND (
                        `login_user` = :login
                        OR `niveau_user` = 30
                    )
            ;";
            
            $result_select_droits = dino_query($query_select_droits, $params_select_droits);

            if ($result_select_droits["status"]) {
                
                $valeurs = [];
                
                foreach($result_select_droits["result"] as $row) {
                    $params_insert_droits = [
                        "client" => $_SESSION["client"],
                        "monde" => $pk_monde,
                        "login" => $row["login_user"]
                    ];
                    
                    $query_insert_droits = "
                        INSERT INTO `user_monde` (
                            `fk_client`,
                            `fk_monde`,
                            `fk_user`
                        ) VALUES (
                            :client,
                            :monde,
                            :login
                        )
                    ;";
            
                    $result_insert_droits = dino_query($query_insert_droits, $params_insert_droits);
                    
                    if (!$result_insert_droits["status"]) {
                        write_log([
                            "libelle" => "INSERT Type dans catégorie",
                            "admin" => 1,
                            "query" => $query,
                            "statut" => 1,
                            "message" => $result_insert_droits["errinfo"][2],
                            "erreur" => $result_insert_droits["errno"],
                            "document" => "",
                            "objet" => $_POST["pk"]
                        ]);
                        $err = true;
                        break;
                    }
                }
            } else {
                write_log([
                    "libelle" => "SELECT Users pour droits",
                    "admin" => 1,
                    "query" => $query,
                    "statut" => 1,
                    "message" => $result_select_droits["errinfo"][2],
                    "erreur" => $result_select_droits["errno"],
                    "document" => "",
                    "objet" => $_SESSION["user"]
                ]);
                $err = true;
            }
        }
        
        foreach($_POST["graveyard"] as $i => $element) {
            switch($element["type"]) {
                case "champ":
                    $err = !delete_champ($element["pk"]);
                    break;
                case "categorie":
                    $err = !delete_categorie($element["champ"], $element["pk"]);
                    break;
                case "type":
                    if (isset($element["categorie"])) {
                        $categorie = $element["categorie"];
                    } else {
                        $categorie = 0;
                    }
                    
                    $err = !delete_type($element["champ"], $categorie, $element["pk"]);
                    break;
            }
            
            if ($err) {
                break;
            }
        }
        
        if (!$err) {
            status(200);
            write_log([
                "libelle" => "SAVE Monde",
                "admin" => 1,
                "query" => $query,
                "statut" => 0,
                "message" => "",
                "erreur" => "",
                "document" => "",
                "objet" => $_POST["pk"]
            ]);
        } else {
            status(500);
            write_log([
                "libelle" => "SAVE Monde",
                "admin" => 1,
                "query" => $query,
                "statut" => 1,
                "message" => $result["errinfo"][2],
                "erreur" => $result["errno"],
                "document" => "",
                "objet" => $_POST["pk"]
            ]);
        }
    } else {
        status(500);
        write_log([
            "libelle" => "INSERT Monde",
            "admin" => 1,
            "query" => $query,
            "statut" => 1,
            "message" => $result["errinfo"][2],
            "erreur" => $result["errno"],
            "document" => "",
            "objet" => $_POST["pk"]
        ]);
    }
} else {
    status(403);
    write_log([
        "libelle" => "INSERT Monde",
        "admin" => 1,
        "query" => $query,
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_POST["pk"]
    ]);
}
?>
