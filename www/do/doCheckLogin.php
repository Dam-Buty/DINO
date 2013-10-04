<?php
session_start();
if (isset($_SESSION["niveau"])) {
    $json = '{ "OK": 1 }';
} else {
    $json = '{ "OK": 0 }';
}
header('Content-Type: application/json');
echo $json;
?>
