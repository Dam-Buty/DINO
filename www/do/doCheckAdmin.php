<?php
session_start();
if ($_SESSION["niveau"] > 20) {
    $json = '{ "OK": 1 }';
} else {
    $json = '{ "OK": 0 }';
}
header('Content-Type: application/json');
echo $json;
?>
