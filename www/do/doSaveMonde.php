<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

function delete_type($champ, $categorie, $pk) {    
    $params_base = [
        "client" => $_SESSION["client"],
        "monde" => $_POST["pk"],
        "champ" => $champ,
        "categorie" => $categorie,
        "pk" => $pk
    ];
    
    // Déclassifie les documents
    // - met à NULL le niveau et la date
    // - DELETE les liens avec des valeurs de champs
    // - Suppression des associations à ce type de doc
    // Suppression du type de doc
    
    $params_null_docs = $params_base;
    unset($params_null_docs["client"]);
    $params_null_docs = array_merge($params_null_docs, [
        "client1" => $_SESSION["client"],
        "client2" => $_SESSION["client"]
    ]);
    
    $params_del_doc_val = $params_base;
    unset($params_del_doc_val["client"]);
    unset($params_del_doc_val["monde"]);
    $params_del_doc_val = array_merge($params_del_doc_val, [
        "client1" => $_SESSION["client"],
        "client2" => $_SESSION["client"],
        "monde1" => $_POST["pk"],
        "monde2" => $_POST["pk"]
    ]);
    
    $params_del_doc_type = $params_base;
    
    $params_del_type = $params_base;
    
    if (dino_query("del_type_documents", $params_null_docs)) {
        if (dino_query("del_type_valeurs", $params_del_doc_val)) {
            if (dino_query("del_type_types", $params_del_doc_type)) {
                if (dino_query("del_type_final", $params_del_type)) {
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
    
    // DELETE LA CATEGORIE
    $params_del_cat = $params_base;
    
    $result_sel_types = dino_query("del_categorie_types", $params_sel_types);
    
    $err = false;
    
    if ($result_sel_types["status"]) {
        
        foreach($result_sel_types["result"] as $row) {
            if (!delete_type($champ, $pk, $row["pk_type_doc"])) {
                $err = true;
                break;
            }
        }
        
        if (!$err) {
            if (!dino_query("del_categorie_final", $params_del_cat)) {
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
    // SELECT les types en racine
    // DELETE les valeurs de champ
    // DELETE le champ
    
    $params_sel_cat = $params_base;
    
    $params_sel_types = $params_base;
    
    $params_del_val = $params_base;
    
    $params_del_champ = $params_base;
    
    $err = false;
    
    // Suppression des types 
    $result_sel_types = dino_query("del_champ_types", $params_sel_types);
    
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
    $result_sel_cat = dino_query("del_champ_categories", $params_sel_cat);
    
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
        if (dino_query("del_champ_valeurs", $params_del_val)) {
            if (dino_query("del_champ_final", $params_del_champ)) {
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
        $query = "monde_add";
    } else {
        $query = "monde_change";
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
                $query_champ = "monde_champ_add";    
            } else {
                $query_champ = "monde_champ_change"; 
                
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
                            "categorie" => 0,
                            "niveau" => $type["niveau"]
                        ];
                        
                        if (!isset($type["pk"])) {
                            $query_type = "monde_type_add";
                        } else {
                            $query_type = "monde_type_change";
                            $params_type["pk"] = $type["pk"];
                        }
                        
                        $result_type = dino_query($query_type,$params_type);
        
                        if (!$result_type["status"]) {
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
                            $query_categorie = "monde_categorie_add";
                        } else {
                            $query_categorie = "monde_categorie_change";
                            $params_categorie["pk"] = $categorie["pk"];
                        }
          
                        $result_categorie = dino_query($query_categorie, $params_categorie);
                
                        if ($result_categorie["status"]) {
                            
                            if (!isset($categorie["pk"])) {
                                $pk_categorie = $result_categorie["result"];
                            } else {
                                $pk_categorie = $categorie["pk"];
                            }
                            
                            if (isset($categorie["types"])) {
                            
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
                                        $query_type = "monde_type_add";
                                    } else {
                                        $query_type = "monde_type_change";
                                        $params_type["pk"] = $type["pk"];
                                    }
                                    
                                    $result_type = dino_query($query_type,$params_type);

                                    if (!$result_type["status"]) {
                                        $err = true;
                                        break;
                                    }
                                } // FIN WHILE TYPES
                            }
                        } else {
                            $err = true;
                            break;
                        }
                        
                    } // FIN WHILE CATEGORIES
                }
            } else {
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
            
            $result_select_droits = dino_query("droits_users", $params_select_droits);

            if ($result_select_droits["status"]) {
                
                $valeurs = [];
                
                foreach($result_select_droits["result"] as $row) {
                    $params_insert_droits = [
                        "client" => $_SESSION["client"],
                        "monde" => $pk_monde,
                        "login" => $row["login_user"]
                    ];
            
                    $result_insert_droits = dino_query("droits_final", $params_insert_droits);
                    
                    if (!$result_insert_droits["status"]) {
                        $err = true;
                        break;
                    }
                }
            } else {
                $err = true;
            }
        }
        
        if (isset($_POST["graveyard"])) {
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
        }
        
        if (!$err) {
            status(200);
        } else {
            status(500);
        }
    } else {
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Save monde : droits insuffisants"
    ]);
    status(403);
}
?>
