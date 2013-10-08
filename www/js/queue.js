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
    
    $("#files-list").empty();
    
    $.each(queue, function(i, document) {
        var custom_class;
        
        switch(document.status) {
            case -1:
                custom_class = "idle";
                custom_text = "En fila";
                break;
            
            case 0:
                custom_class = "uploading";
                custom_text = "";
                break;
                
            case 1:
                custom_class = "ready";
                custom_text = "Cargado";
                break;
        }
        
        
        var document_li = $("<li></li>");
        
        document_li.addClass(custom_class)
        .append(this.document.name + " - <i>" + custom_text + "</i>");
        
        $("#files-list").append(document_li);
        
        queue[i].li = document_li;
    });
};

var upload = function(file, uploader, queue_position) {
    var upload_data = new FormData;
    
    refresh_liste();
    
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
                        document_li = queue[queue_position].li;
                        document_li.find("i").text(evt.loaded + " / " + evt.total);
                    }
                }, false);
            }
            return myXhr;
        },
        success: function() {
            uploading[uploader] = undefined;
            queue[queue_position].status = 1;
            document_li = queue[queue_position].li;
            document_li.find("i").text("OK");
            handle_uploads();
        },
        error: function() {
            document_li = queue[queue_position].li;
            document_li.find("i").text("KO");
            handle_uploads();
        }
    });

    return false;
};

///////////////////:
// Cherche un uploader libre et lui attribue le premier fichier de la queue
var handle_uploads = function() {
    $.each(uploading, function(i, uploader) {
        if (uploader === undefined) {
            $.each(queue, function(j, document) {
                if (document.status == -1) {
                    queue[j].status = 0;
                    uploading[i] = document.document;
                    upload(document.document, i, j);
                    return false;
                }
            });
        }
    });
}

///////////////////////////:
// Gestion des fichiers entrés dans l'input
var handle_files = function() {
    files = $("#files-handler").prop("files");
    
    $.each(files, function() {
        var file_tab = this.name.split(".");
        var extension = file_tab[file_tab.length - 1];
        
        // Si l'extension est légale, on pousse le fichier dans la queue
        if (extension in allowed_extensions) {
            queue.push({ document: this, status: -1, size: this.size, li: undefined });
        }
    });
    
    handle_uploads();
};

var assign_worker = function() {
    //console.log("Checking for free workers");
    if (queue.length > 0) {
        var free_workers = [];
        var done = 0;
        
        // On fait un tableau des workers libres
        for (var i = 0; i < workers.length; i++) {
            if (workers[i] === undefined) {
                free_workers.push(i);
            }
        }
        
        // Si on a au moins un worker libre on parcourt la queue
        if (free_workers.length > 0) {
            $.each(queue, function() {
                // Si on trouve un document éligible on l'assigne au premier worker libre, qu'on supprime du tableau
                if (this.status == 0) {
                    workers[free_workers[0]] = this;
                    console.log("Affected worker " + free_workers[0] + " to file " + this.name);
                    this.status = 1;
                    
                    // lancement du WebWorker
                    var worker = new Worker('js/worker.js');
                    
                    worker.addEventListener('message', function(e) {
                      console.log('Worker said: ', e.data);
                    }, false);
                    
                    worker.postMessage(workers[free_workers[0]]);
                    
                    free_workers.splice(0, 1);
                }
                
                if (free_workers.length == 0) {
                    return false;
                }
            });
        } else {
            //console.log("None Found");
        }
    } else {
        //console.log("Queue empty");
    }
}

// On vérifie toutes les secondes si il y a un worker qui glande
// window.setInterval(assign_worker, 5000);

