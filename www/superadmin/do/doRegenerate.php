<?php
session_start();
if (isset($_SESSION["superadmin"])) {
    include("../../includes/mysqli.php");
    
    $query = "
        DELETE FROM `user_monde`
        WHERE 
            `fk_client` = :umClient
            AND `fk_user` = (
                SELECT `login_user`
                FROM `user`
                WHERE 
                    `fk_client` = :uClient
                    AND `niveau_user` = 30
            )
        ;
        ";
    
    $result = dino_query($query,[
        "umClient" => $_POST["client"],
        "uClient" => $_POST["client"]
    ]);
    
    if ($result["status"]) { 
        foreach($_POST["mondes"] as $i => $monde) {
            $query = "
            INSERT INTO `user_monde` (
                `fk_client`,
                `fk_monde`,
                `fk_user`
            ) VALUES (
                :umClient,
                :umMonde,
                (
                    SELECT `login_user`
                    FROM `user`
                    WHERE 
                        `fk_client` = :uClient
                        AND `niveau_user` = 30
                )
            );";
            
            $result = dino_query($query,[
                "umClient" => $_POST["client"],
                "umMonde" => $monde,
                "uClient" => $_POST["client"]
            ]);
        }
    }
}
?>
