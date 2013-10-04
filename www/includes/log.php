<?
// Fonctions de log
// ouverture du fichier

function write_log($message) {
    $timestamp = date("Ymd");
    if (isset($_SESSION["username"])) {
        $fic_log = fopen($_SERVER['DOCUMENT_ROOT'] . "/cssdev/log/" . $timestamp . "_" . $_SESSION["username"] . ".log", "a");    
    }
    else {
        $fic_log = fopen($_SERVER['DOCUMENT_ROOT'] . "/../log/" . $timestamp . "_" . $_SERVER['REMOTE_ADDR'] . ".log", "a");    
    }
    $timestamp = date("H:i:s");
    fwrite($fic_log, $timestamp . " : " . $message . "\n");
    fclose($fic_log);
    return 0;
}
?>
