<?php
session_start();
if (isset($_SESSION["niveau"])) {
?>
<div id="amenu-wrapper">
    <ul id="amenu-list">
        <li>
            <a href="logout.php" id="logout">Desconectar</a>
        </li>
        <li>
            <a href="#" id="archive">Sus archivos</a>
        </li>
        <?php if ($_SESSION["niveau"] > 20) { ?>
        <li>
            <a href="#">Administraction</a>
            <ul>
                <li>
                    <a href="#" id="users">Gestion de usuarios</a>
                </li>
                <li>
                    <a href="#" id="clients">Gestion de clientes</a>
                </li>
            </ul>
        </li>
        <?php } ?>
        <li>
            <a href="#">Parametros</a>
            <ul>
                <li>
                    <a href="#" id="pass">Contraseña</a>
                </li>
                <?php if ($_SESSION["niveau"] > 20) { ?>
                <li>
                    <a href="#" id="douanes">Aduanas</a>
                </li>
                <li>
                    <a href="#" id="credits">Creditos</a>
                </li>
                <?php } ?>
            </ul>
        </li>
    </ul>
    <?php if ($_SESSION["niveau"] > 20) { ?>
    <span style="float: right; font-weight: bold;">Sus creditos : 
        <span id="credit_counter" class="counter counter-analog" data-direction="up" data-interval="5" data-format="999">0</span>
    </span>
    <?php } ?>
</div>
<?php } ?>
