<?php
require 'vendor/autoload.php';
use Mailgun\Mailgun;

//////////////////////////
///// FONCTIONS DINO    
//////////////////////////
///// - Dino Delete
///// - DINOSQL
///// - Logs
///// - Mails
///// - Status
///// - Cryptage


//////////////////////////
///// Dino Delete
//////////////////////////

function dino_delete($filename, $client = "") {
    if ($client == "") {
        $client = $_SESSION["client"];
    }
    
    $path = "../cache/" . $client . "/" . $filename . ".dino";
    $pdfpath = "../cache/" . $client . "/" . $filename . "-pdf.dino";
    $txtpath = "../cache/" . $client . "/" . $filename . "-txt.dino";
    
    if (unlink($path)) {       
        dino_log([
            "niveau" => "I",
            "message" => "Unlink original",
            "query" => $_POST["filename"]
        ]); 
    
        if (file_exists($pdfpath)) {
            if (unlink($pdfpath)) {
                dino_log([
                    "niveau" => "I",
                    "message" => "Unlink PDF version",
                    "query" => $_POST["filename"]
                ]);
            } else {
                dino_log([
                    "niveau" => "E",
                    "query" => "unlink " . $pdfpath,
                    "errno" => 666,
                    "errinfo" => "Impossible de supprimer",
                    "params" => json_encode($_POST["filename"])
                ]);
            }
        }   
        
        if (file_exists($txtpath)) {
            if (unlink($txtpath)) {
                dino_log([
                    "niveau" => "I",
                    "message" => "Unlink TXT version",
                    "query" => $_POST["filename"]
                ]);
            } else {
                dino_log([
                    "niveau" => "E",
                    "query" => "unlink " . $txtpath,
                    "errno" => 666,
                    "errinfo" => "Impossible de supprimer",
                    "params" => json_encode($_POST["filename"])
                ]);
            }
        }
    } else {
        dino_log([
            "niveau" => "E",
            "query" => "unlink " . $path,
            "errno" => 666,
            "errinfo" => "Impossible de supprimer",
            "params" => json_encode($_POST["filename"])
        ]);
    }
}

//////////////////////////
///// DINOSQL v1.0
//////////////////////////

class DINOSQL {
#    private $hostname = "127.0.0.1";
#    private $username = "dino_prod_root";
#    private $dbname = "dino_prod";
#    private $password = "G00D_2-e4t-1000_yrz!"; 
#####################
#    private $hostname = "127.0.0.1";
#    private $username = "dino_baby_root";
#    private $dbname = "dino_baby";
#    private $password = "C4dillac5"; 
#####################
    private $hostname = "localhost";
    private $username = "root";
    private $dbname = "dino";
    private $password = "C4dillac5";
    
    private $options = [
        PDO::ATTR_PERSISTENT         => true,
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET time_zone = '-06:00'"
    ];
    
    private $dsn;
    private $dbh;
    
    public function __construct() {
        try {
            $this->dsn = "mysql:host=" . $this->hostname . ";dbname=" . $this->dbname . ";charset=utf8";
            $this->dbh = new PDO($this->dsn, $this->username, $this->password, $this->options);
            
            $this->dbh->beginTransaction();
        } catch (PDOException $e) { // Erreur connection BdD
            dino_log([
                "niveau" => "X",
                "message" => "Erreur de connexion à la base de données!",
                "errinfo" => $e->getMessage()
            ]);
            
            throw new Exception("Erreur de connection", 1);
        }
    }
    
    public function query($query_name, $params = [], $substitutions = []) {
        $query_array = explode("\n", file_get_contents("../sql/" . $query_name . ".sql"));
        
        $message = array_shift($query_array);
        $query = implode("\n", $query_array);
        
        $query_type = substr(trim(explode("\n", $query)[0]), 0, 6);
        
        if (count($substitutions) > 0) {
            foreach($substitutions as $key => $value) {
                $query = str_replace("%" . $key . "%", $value, $query);
            }
        }
            
        $stmt = $this->dbh->prepare($query);
        
        try {
            $stmt->execute($params);
            
            dino_log([
                "niveau" => "I",
                "message" => $message,
                "query" => $query_name
            ]);
            
            switch($query_type) {
                case "SELECT":
                    return $stmt->fetchAll();
                case "INSERT":
                    return $this->dbh->lastInsertId();
                case "UPDATE":
                    return $stmt->rowCount();
                case "DELETE":
                    return $stmt->rowCount();
            }
        } catch (Exception $e) {            
            dino_log([
                "niveau" => "E",
                "query" => $query_name,
                "errno" => $stmt->errorCode(),
                "errinfo" => $stmt->errorInfo()[2],
                "params" => json_encode($params) . "," . json_encode($substitutions)
            ]);
            
            throw new Exception("Erreur de requete", 2);
        }
    }
    
    public function commit() {
        $this->dbh->commit();
        $this->dbh = null;
    }
    
    public function rollback() {
        $this->dbh->rollback();
        $this->dbh = null;
    }
}

//////////////////////////
///// Logs
//////////////////////////

function dino_log($params) {
    if (!isset($_SESSION["user"])) {
        $user = "";
    } else {
        $user = $_SESSION["user"];
    }
    
    if (!isset($_SESSION["client"])) {
        $client = 0;
    } else {
        $client = $_SESSION["client"];
    }
    
    $tableau_log = [
        $params["niveau"],
        date("Y-m-d H:i:s"),
        $client,
        $user
    ];
    
    switch($params["niveau"]) {
        case "D": array_push($tableau_log, $params["message"]);
            break;
        case "I":
            array_push($tableau_log, $params["query"]);
            array_push($tableau_log, $params["message"]);
            break;
        case "W":
        
            break;
        case "E":
            array_push($tableau_log, $params["query"]);
            array_push($tableau_log, $params["errno"]);
            array_push($tableau_log, $params["errinfo"]);
            array_push($tableau_log, $params["params"]);
            break;
        case "X":
            array_push($tableau_log, $params["message"]);
            array_push($tableau_log, $params["errinfo"]);
            break;
        case "Z":
            array_push($tableau_log, "Accés non autorisé!");
            array_push($tableau_log, $params["query"]);
            break;
             
    };
    
    array_push($tableau_log, $_SERVER['HTTP_REFERER']);
    array_push($tableau_log, $_SERVER['REMOTE_ADDR']);
    
    $tableau_final = [];
    
    foreach($tableau_log as $ligne) {
        array_push($tableau_final, str_replace(PHP_EOL, "|", $ligne));
    }
    
    $ligne_log = join("|", $tableau_final) . "\r\n";
        
    $path = "../log/" . date("Y-m-d") . ".csv";
    
    file_put_contents($path, $ligne_log, FILE_APPEND);
}

function debug($message) {
    dino_log([
        "niveau" => "D",
        "message" => $message
    ]);
}

//////////////////////////
///// Mails
//////////////////////////

function dinomail($adresse, $mail, $attach = [], $subst = []) {

    # Instantiate the client.
    $mgClient = new Mailgun('key-8mwfyrfwzmam66qe-20my2lqcmt-o6k4');
    $domain = "dino.mx";
    
    $path = "../mails/";
    
    // Récupère le contenu du mail
    $text = file_get_contents($path . $mail . ".txt");
    $html = file_get_contents($path . $mail . ".html");
    $sujet = file_get_contents($path . $mail . ".subject");
    
    foreach($subst as $key => $value) {
        $text = str_replace("%" . $key . "%", $value, $text);
        $html = str_replace("%" . $key . "%", $value, $html);
    }
    
#    debug($adresse);
#    debug($sujet);
#    debug($text);
#    debug($html);
#    debug($attach);
    
    # Make the call to the client.
    try {
        $mgClient->sendMessage(
            $domain, [
                'from'    => 'DINO <mailgun@dino.mx>',
                'to'      => $adresse,
                'subject' => $sujet,
                'text'    => $text,
                'html'    => $html
            ], [
                'attachment' => $attach
            ]
        );
    } catch (Exception $e ) {
        dino_log([
            "niveau" => "E",
            "query" => $mail,
            "errno" => $e->getCode(),
            "errinfo" => $e->getMessage(),
            "params" => $adresse
        ]);
    }
}

//////////////////////////
///// Status HTTP
//////////////////////////

function status($code) {
    $tab_status = array(
        200 => "200 OK",
        201 => "201 CREATED",
        204 => "204 NO CONTENT",
        400 => "400 BAD REQUEST",
        402 => "402 PAYMENT REQUIRED",
        403 => "403 FORBIDDEN",
        404 => "404 NOT FOUND",
        500 => "500 INTERNAL SERVER ERROR"
    );
    
    header("HTTP/1.1 " . $tab_status[$code]);
}

//////////////////////////
///// Cryptage
//////////////////////////

// Hash SHA256
function custom_hash($clef, $b64 = FALSE) {
    return hash("sha256", $clef, !$b64);
}

// Génération d'une chaine de n caractères au hasard
// Si alpha = TRUE on n'utilise que des lettres et des chiffres
function genere_clef($n, $alpha = FALSE) {
    if ($alpha) {
        $alphabet = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
    } else {
        $alphabet = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789-=~!@#$%&*()_+,.<>?;:[]{}|";
    }
    
    $alphaLength = strlen($alphabet) - 1;
    
    // Génération de la clef de sécurité du client.
    $clef = "";

    for ($i = 1; $i <= $n;$i++) {
        $k = rand(0, $alphaLength);
        $clef .= $alphabet[$k];
    }
    
    return $clef;
}

function crypte($key, $input) {
    $td = mcrypt_module_open('rijndael-256', '', 'cbc', '');
    $iv = mcrypt_create_iv(mcrypt_enc_get_iv_size($td), MCRYPT_RAND);
    mcrypt_generic_init($td, $key, $iv);
    $encrypted_data = mcrypt_generic($td, $input);
    $retour = $iv . $encrypted_data;
    mcrypt_generic_deinit($td);
    mcrypt_module_close($td);

    return base64_encode($retour);
}

function decrypte($key, $input) {
    $td = mcrypt_module_open('rijndael-256', '', 'cbc', '');
    
    $input = base64_decode($input);
    
    $iv = substr($input, 0, mcrypt_enc_get_iv_size($td));
    $data = substr($input, mcrypt_enc_get_iv_size($td));
    
    mcrypt_generic_init($td, $key, $iv);
    $retour = mdecrypt_generic($td, $data);
    mcrypt_generic_deinit($td);
    mcrypt_module_close($td);
    
    return $retour;
}

function crypte_sym($input) {
    openssl_public_encrypt($input, $encrypted, "file://../public/public_key.pem");
#    debug($input);
#    debug(base64_encode($encrypted));
    return base64_encode($encrypted);
}
?>
