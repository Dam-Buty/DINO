<?php
session_start();
if (isset($_SESSION["superadmin"])) {
include("../includes/mysqli.php");
?>
<div>
    <form name="leForm" action="do/doInscription.php" method="post">
            <label for="entreprise">Entreprise : </label>
                <input type="text" name="entreprise"/>
                <br/>
            <label for="mail">Mail : </label>
                <input type="text" name="mail" id="mail"/>
                <br/>
            <label for="nom_contact">Nom du contact : </label>
                <input type="text" name="nom_contact"/>
                <br/>
            <label for="poste_contact">Poste du contact : </label>
                <input type="text" name="poste_contact"/>
                <br/>
            <label for="phone_contact">Téléphone du contact : </label>
                <input type="text" name="phone_contact"/>
                <br/>
            <label for="bucket">Bucket : </label>
                <input type="text" name="bucket"/>
                <br/>
            <label for="credit">Credits : </label>
                <input type="text" name="credit"/>
                <br/>
                <br/>
                <br/>
            <label for="credit">Nom d'utilisateur gestionnaire : </label>
                <input type="text" name="login" id="login"/>
                <br/>
            <label for="credit">MDP gestionnaire : </label>
                <input type="text" name="password" id="password"/>
                <br/>
            <input type="submit" value="Valider"/>
    </form>
</div>

<?php
}
?>
