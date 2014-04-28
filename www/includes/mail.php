<?php
require 'vendor/autoload.php';
use Mailgun\Mailgun;

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
    
    debug($adresse);
    debug($sujet);
    debug($text);
    debug($html);
    debug($attach);
    
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
?>
