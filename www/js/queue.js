var allowed_extensions = {
    "pdf": 1,
    "jpg": 1,
    "png": 1,
    "gif": 1,
    "xml": 1
}

var queue = [];

var uploading = [undefined, undefined, undefined];

var compare = function(a,b) {
  if (a.status > b.status)
     return -1;
  if (a.status < b.status)
    return 1;
  return 0;
}

var handle_drag = function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    console.log(evt);
    evt.dataTransfer.dropEffect = 'copy';
};

var handle_drop = function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    console.log(evt);
    
    var files = evt.dataTransfer.files;
};

var refresh_liste = function() {
    queue.sort(compare);
    
    $("#files-list li").detach();
    
    $.each(queue, function(i, document) {
        $("#files-list").append(queue[i].li);
    });
};

var upload = function(file, uploader, queue_position) {
    var upload_data = new FormData;
    
    upload_data.append("document", file);

    $.ajax({
        url: "do/doUpload.php",
        data: upload_data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        xhr: function() {  // custom xhr pour récuperer la progression
            myXhr = $.ajaxSettings.xhr();
            if(myXhr.upload){ // if upload property exists
                myXhr.upload.addEventListener('progress', function(evt) {
                    if(evt.lengthComputable){
                        var pourcentage = Math.floor((evt.loaded * 100) / evt.total);
                        
                        document_li = queue[queue_position].li;
                        document_li.css("background-size", pourcentage + "%" + " 100%");
                        document_li.find("span").text(pourcentage + "%");
                    }
                }, false);
            }
            return myXhr;
        },
        success: function() {
            uploading[uploader] = undefined;
            queue[queue_position].status = 1;
            
            queue[queue_position].li
            .removeClass()
            .css("background-size", "0 0")
            .addClass("done")
            .find("span").text("OK");
            
            handle_uploads();
        },
        error: function() {
            uploading[uploader] = undefined;
            queue[queue_position].status = -2;
            
            queue[queue_position].li
            .removeClass()
            .css("background-size", "0 0")
            .addClass("error")
            .find("span").text("KO");
            
            handle_uploads();
        }
    });

    return false;
};

///////////////////:
// Cherche un uploader libre et lui attribue le premier fichier de la queue
var handle_uploads = function() {
    refresh_liste();
    
    $.each(uploading, function(i, uploader) {
        if (uploader === undefined) {
            $.each(queue, function(j, document) {
                if (document.status == -1) {
                    queue[j].status = 0;
                    uploading[i] = document.document;
                    queue[j].li.removeClass().addClass("uploading");
                    upload(document.document, i, j);
                    return false;
                }
            });
        }
    });
}

////////////////////////////
// Gestion des fichiers entrés dans l'input
var handle_files = function() {
    files = $("#files-handler").prop("files");
    
    $.each(files, function() {
        var file_tab = this.name.split(".");
        var extension = file_tab[file_tab.length - 1];
        
        // Si l'extension est légale, on pousse le fichier dans la queue
        if (extension in allowed_extensions) {
            var document_li = $("<li></li>");
            
            document_li.removeClass().addClass("idle")
            .append(this.name + " - <span>En fila</span>");
            
            queue.push({ document: this, status: -1, size: this.size, li: document_li });
        }
    });
    
    handle_uploads();
};

