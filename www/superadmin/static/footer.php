<script src="../../js/jquery-1.10.2.js?v=1"></script>
<script src="../../js/aes.js?v=1"></script>
<script src="../../js/sha3.js?v=1"></script>
<script src="../../js/CS.Crypto.js?v=1"></script>

<script type="text/javascript">
    var wrapper_clef = function() {
        $("#clef_user").val(genere_clef(256, $("#login").val(), $("#pass_display").val(), $("#mail").val()));
        $("#password").val(custom_hash($("#pass_display").val()));
    };
    
    $("#login").change(wrapper_clef);
    $("#pass_display").change(wrapper_clef);
    $("#mail").change(wrapper_clef);
</script>

</body>
</html>
