<?php
function status($code) {
    $tab_status = array(
        200 => "200 OK",
        201 => "201 CREATED",
        204 => "204 NO CONTENT",
        400 => "400 BAD REQUEST",
        403 => "403 FORBIDDEN",
        404 => "404 NOT FOUND",
        500 => "500 INTERNAL SERVER ERROR"
    );
    
    header("HTTP/1.1 " . $tab_status[$code]);
}
?>
