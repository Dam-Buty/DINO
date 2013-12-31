<?php
session_start();
?>
<div id="core">
    <div id="liste">
        
    </div>
</div>

<script type="text/javascript">
    
    $("#search").change(function(evt, params) {
        Core.recherche.length = 0;
        $.each(evt.currentTarget.selectedOptions, function(i, option) {
            var sel = $(option);
            Core.recherche.push({ champ: sel.attr("data-champ"), valeur: sel.attr("data-pk") });
        })
        charge_documents();
    });
    
    bootstrap_list();
    
</script>
