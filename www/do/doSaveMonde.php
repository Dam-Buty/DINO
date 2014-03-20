<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");
if ($_SESSION["niveau"] >= 20) {
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
