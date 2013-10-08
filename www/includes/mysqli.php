<?php
//Variables for connecting to your database.
//These variable values come from your hosting account.

$hostname_db = "localhost";
$username_db = "cssdev_db";
$dbname_db = "cssdev";
$password_db = "C4dillac5_W3B";

$mysqli = new mysqli($hostname_db, $username_db, $password_db, $dbname_db);

/* check connection */
if (mysqli_connect_errno()) {
    write_log("Erreur de connection à la base de données: %s\n", mysqli_connect_error());
}
?>
 
