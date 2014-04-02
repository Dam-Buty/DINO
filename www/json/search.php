<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

if (isset($_SESSION["niveau"])) {
    include("../includes/PDO.php");
    
    $liste = [];
    
    if($_POST["all"] == false) {
        $all = 0;
    } else {
        $all = 1;
    }
    
    $params = [
        "dvcClient" => $_SESSION["client"],
        "dvcMonde" => $_POST["monde"],
        "vcClient" => $_SESSION["client"],
        "vcMonde" => $_POST["monde"],
        "dvc1Client" => $_SESSION["client"],
        "dvc1Monde" => $_POST["monde"],
        "vc1Client" => $_SESSION["client"],
        "vc1Monde" => $_POST["monde"],
        "dvc2Client" => $_SESSION["client"],
        "dvc2Monde" => $_POST["monde"],
        "vc2Client" => $_SESSION["client"],
        "vc2Monde" => $_POST["monde"],
        "tdClient" => $_SESSION["client"],
        "tdMonde" => $_POST["monde"],
        "tddClient" => $_SESSION["client"],
        "tddMonde" => $_POST["monde"],
        "dClient" => $_SESSION["client"],
        "tdd2Client" => $_SESSION["client"],
        "tdd2Monde" => $_POST["monde"],
        "d2Client" => $_SESSION["client"],
        "niveauDoc" => $_SESSION["niveau"],
        "niveauType" => $_SESSION["niveau"],
        "niveauCategorie" => $_SESSION["niveau"],
        "all_droits" => $all,
        "mini" => $_POST["dates"]["mini"],
        "maxi" => $_POST["dates"]["maxi"],
        "cdClient" => $_SESSION["client"],
        "cdMonde" => $_POST["monde"],
        "searchClient" => $_SESSION["client"],
        "searchMonde" => $_POST["monde"],
        "droitsClient" => $_SESSION["client"]
    ]; 
    
    if (count($_POST["recherche"]) > 0) {
        $search = "";
        foreach($_POST["recherche"] as $i => $valeur) {
            if ($search != "") {
                $search .= ", ";
            }
            $search .= $valeur;
        }
    }
    
    if ($_POST["all"] == "false" && count($_POST["droits"]) > 0) {
        $droits = "";
        foreach($_POST["droits"] as $pk => $label) {
            if ($droits != "") {
                $droits .= ", ";
            }
            $droits .= $pk;
        }
    }

    $result = dino_query("search", $params, [
        "search" => $search,
        "droits" => $droits
    ]);
    
    
    if ($result["status"]) {
        $valeurs_champs = [];
        $categorie = 0;
        $year = 0;
        $month = 0;
        $decal_categorie = 0;    
        
        foreach($result["result"] as $row) {
            $champs_documents = [];
            $year_document = 0;
            $month_document = 0;
            
            if ($row["time"] != 0) {
                $year_document = substr($row["time"], 0, 4);
                $month_document = substr($row["time"], 4, 2);
            }
            
            
            // Extraction des valeurs de champs
            foreach(explode("||", $row["champs"]) as $key => $valeur) {
                array_push($champs_documents, $valeur);
            }
            
            // Rupture de valeur de champ
            if ($champs_documents != $valeurs_champs) {
#                array_push($liste, [ "test" => "test" ]);
                $year = 0;
                $month = 0;
                $categorie = 0;
                $decal_categorie = 0;
                
                foreach($champs_documents as $niveau => $champ) {
                    if ($champ != $valeurs_champs[$niveau]) {
                        array_push($liste, [
                            "type" => "champ",
                            "niveau" => $niveau,
                            "pk" => $champ
                        ]);
                    }
                }
            }
            
            // Rupture d'année
            if ($year_document != $year) {
                array_push($liste, [
                    "type" => "an",
                    "an" => $year_document
                ]);
                $year = $year_document;
                $month = 0;
            }
            
            // Rupture de mois
            if ($month_document != $month) {
                array_push($liste, [
                    "type" => "mois",
                    "mois" => $month_document
                ]);
                $decal_categorie = 2;
                $month = $month_document;
                $categorie = 0;
            }
            
#            array_push($liste, [
#                "dbg" => $decal_categorie
#            ]);        
                
            // Rupture de catégorie
            if ($row["categorie"] != $categorie) {
                array_push($liste, [
                    "type" => "categorie",
                    "niveau" => count($champs_documents) + $decal_categorie,
                    "pk" => $row["categorie"]
                ]);
            }
           
            // Ajout du document
            $document = [
                "type" => $row["type"],
                "filename" => $row["filename"],
                "display" => $row["display"],
                "date" => $row["date"],
                "detail" => $row["detail"],
                "time" => $row["time"],
                "revision" => $row["revision"]
            ];
            
            array_push($liste, $document);
            
            $valeurs_champs = $champs_documents;
            $categorie = $row["categorie"];
        }
        
        
        $json = json_encode($liste);
        status(200);
        header('Content-Type: application/json');
        echo $json;
    } else {
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Search : pas de niveau session"
    ]);
    status(403);
}
?>
