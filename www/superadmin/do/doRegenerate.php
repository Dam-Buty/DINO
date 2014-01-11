<?php
session_start();
if (isset($_SESSION["superadmin"])) {
    include("../../includes/mysqli.php");
    
    $query = "
        DELETE FROM `user_monde`
        WHERE 
            `fk_client` = " . $_POST["client"] . "
            AND `fk_user` = (
                SELECT `login_user`
                FROM `user`
                WHERE 
                    `fk_client` = " . $_POST["client"] . "
                    AND `niveau_user` = 30
            )
        ;
        ";
    
    foreach($_POST["mondes"] as $i => $monde) {
        $query .= "
        INSERT INTO `user_monde` (
            `fk_client`,
            `fk_monde`,
            `fk_user`
        ) VALUES (
            " . $_POST["client"] . ",
            " . $monde . ",
            (
                SELECT `login_user`
                FROM `user`
                WHERE 
                    `fk_client` = " . $_POST["client"] . "
                    AND `niveau_user` = 30
            )
        );";
    }
    
    if ($mysqli->multi_query($query)) {
        $i = 0; 
        do { 
            $i++; 
        } while ($mysqli->next_result()); 
        
    }
}
?>
