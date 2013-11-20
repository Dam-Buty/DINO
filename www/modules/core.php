<div id="core">
    <div id="core-top">
        <ul class="list-mondes" id="mondes-top"></ul>
        <select class="busquedor" type="text" id="search" multiple="multiple" data-placeholder="Buscar en este mundo..."/>
        <div id="list-sort"><h1>A-Z</h1></div>
    </div>
    <div id="liste">
        
    </div>
</div>

<script type="text/javascript">
    $("#search").chosen({
        create_option: add_value,
        skip_no_results: true,
        inherit_select_classes: true,
        placeholder_text_multiple: "Buscar en este mundo...",
        search_contains: true
    });
    
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
