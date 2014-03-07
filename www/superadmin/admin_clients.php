<?php
if (isset($_SESSION["superadmin"])) {
include("../includes/PDO.php");
?>
<div>
    <form name="leForm" action="do/doInscription.php" method="post">
        <label for="entreprise">Entreprise : </label>
            <input type="text" name="entreprise"/>
            <br/>
        <label for="mail">Mail : </label>
            <input type="text" name="mail" id="mail"/>
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
