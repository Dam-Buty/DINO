<?php

function mail($adresse, $mail, $attach = [], $subst = []) {
    require 'vendor/autoload.php';
    use Mailgun\Mailgun;

    # Instantiate the client.
    $mgClient = new Mailgun('key-8mwfyrfwzmam66qe-20my2lqcmt-o6k4');
    $domain = "baby.dino.mx";
    
    // Récupère le contenu du mail
    
    $text = file_get_contents("../mails/" . $mail . ".txt");
    $html = file_get_contents("../mails/" . $mail . ".html");
    $sujet = file_get_contents("../mails/" . $mail . ".subject");
    
    foreach($subst as $key => $value) {
        $text = str_replace("$" . $key . "$", $value, $text);
        $html = str_replace("$" . $key . "$", $value, $html);
    }

    # Make the call to the client.
    $result = $mgClient->sendMessage(
        "$domain", [
            'from'    => 'DINO <mailgun@dino.mx>',
            'to'      => $adresse,
            'subject' => $sujet,
            'text'    => $text,
            'html'    => $html
        ], [
            'attachment' => $attach
        ]
    );
    
    echo $result;
}

mail("dam.buty@gmail.com", "creation_visiteur", [], [
    "user" => "dam.buty",
    "client" => "Correo Solucion",
    "pass" => "Pa55w0rD"
]);

?>
