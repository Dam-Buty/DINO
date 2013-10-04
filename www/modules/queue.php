<div id="container-queue" data-state="closed">
    <div id="poignee-queue"></div>
    <div id="tiroir-queue">
        <h1>Fila <input type="file" id="files-handler" name="files-handler" multiple="multiple"></h1>
        <ul id="files-list"></ul>
    </div>
</div>
<script type="text/javascript">
    $("#poignee-queue").click(anime_queue);
    $("#files-handler").change(handle_files);
    
    $("#poignee-queue").on("dragover", handle_drag);
    $("#poignee-queue").on("drop", handle_drop);
</script>
