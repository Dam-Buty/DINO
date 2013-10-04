<div id="container_queue" data-state="closed">
    <div id="poignee_queue">
        <div id="inner_poignee_queue"></div>
    </div>
    <div id="tiroir_queue">
        <h1>Fila <input type="file" id="files_handler" name="files_handler" multiple="multiple"></h1>
        <ul id="files_list"></ul>
    </div>
</div>
<script type="text/javascript">
    $("#poignee_queue").click(anime_queue);
    $("#files_handler").change(handle_files);
</script>
