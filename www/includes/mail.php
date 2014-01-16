<?php
require 'vendor/autoload.php';
use Mailgun\Mailgun;

function dinomail($adresse, $mail, $attach = [], $subst = []) {

    # Instantiate the client.
    $mgClient = new Mailgun('key-8mwfyrfwzmam66qe-20my2lqcmt-o6k4');
    $domain = "dino.mx";
    
    // Récupère le contenu du mail
    
    $text = file_get_contents("../mails/" . $mail . ".txt");
    $html = file_get_contents("../mails/" . $mail . ".html");
    $sujet = file_get_contents("../mails/" . $mail . ".subject");
    
    foreach($subst as $key => $value) {
        $text = str_replace("%" . $key . "%", $value, $text);
        $html = str_replace("%" . $key . "%", $value, $html);
    }

    # Make the call to the client.
    try {
        $mgClient->sendMessage(
            "$domain", [
                'from'    => 'DINO <mailgun@dino.mx>',
                'to'      => $adresses,
                'subject' => $sujet,
                'text'    => $text,
                'html'    => $html
            ], [
                'attachment' => $attach
            ]
        );
        return "";
    } catch (Exception $e ) {
        return $e->getMessage();
    }
}
?>
