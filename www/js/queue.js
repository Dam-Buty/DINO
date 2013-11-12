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

var anime_queue = function() {
    if ($("#container-queue").attr("data-state") == "closed") {
        $("#tiroir-queue").animate({ left: 0 });
        $("#poignee-queue").animate({ left: "30%" });
        $("#container-queue").attr({ "data-state": "open" });
    } else {
        $("#tiroir-queue").animate({ left: "-30%" });
        $("#tiroir-store").animate({ left: "-65%" });
        $("#poignee-queue").animate({ left: "0" });
        $("#container-queue").attr({ "data-state": "closed" });
        $("#tiroir-store").attr({ "data-state": "closed" });
    }
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
        $("#files-list").append(queue[i].li.attr("data-position", i));
    });
    
    $(".bouton-edit-li").unbind().click(store_document);
    $(".bouton-del-li").unbind().click(remove_document);
};

var upload = function(list_element, uploader, queue_position) {
    var upload_data = new FormData;
    
    upload_data.append("document", list_element.document);

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
                        
                        document_li = list_element.li;
                        document_li.css("background-size", pourcentage + "%" + " 100%");
                        document_li.find("span").eq(1).text(pourcentage + "%");
                    }
                }, false);
            }
            return myXhr;
        },
        statusCode: {
            201: function(data) {
                uploading[uploader] = undefined;
                queue[queue_position].status = 1;
                queue[queue_position].filename = data.filename;
                
                document_li = list_element.li;
                document_li.css( "background-size", "0% 100%" );
                document_li.css( "background-image", "url(img/jauge_vert.png)" );
                document_li.css( "background-size", "35% 100%" );
                document_li.find("span").eq(1).text("Codificando");
                
                
                $.ajax({
                    url: "do/doPack.php",
                    type: "POST",
                    data: {
                        document: queue[queue_position].filename
                    },
                    statusCode: {
                        200: function() {
                            document_li.css( "background-size", "100% 100%" );
                            set_li_status(queue[queue_position].li, 1);
                            handle_uploads();
                        },
                        500: function() {
                            uploading[uploader] = undefined;
                            queue[queue_position].status = -2;
                            
                            set_li_status(queue[queue_position].li, -2);
                            
                            handle_uploads();
                        }
                    }
                });
                
                handle_uploads();
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                uploading[uploader] = undefined;
                queue[queue_position].status = -2;
                
                set_li_status(queue[queue_position].li, -2);
                
                handle_uploads();
            }
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
                    if (document.size > profil.maxfilesize) {
                        queue[j].status = -3;
                        set_li_status(queue[j].li, -3);
                        refresh_liste();
                    } else {
                        queue[j].status = 0;
                        uploading[i] = document.document;
                        set_li_status(queue[j].li, 0);
                        upload(queue[j], i, j);
                        return false;
                    }
                }
            });
        }
    });
}

var remove_document = function() {
    var position = $(this).closest("li").attr("data-position");
    var list_element = queue[position];
    
    // TODO : c'est plus simple si le fichier est en erreur (pas d'AJAX)
    
    $.ajax({
        url: "do/doRemoveFromQueue.php",
        type: "POST",
        data: {
            filename: list_element.filename
        },
        statusCode: {
            204: function() {
                queue.splice(position, 1);
                refresh_liste();
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup('Error de supresion del documento. Gracias por intentar otra vez', 'error'); // LOCALISATION
            }
        }
    });
}

var set_li_status = function(li, status) {
    var custom_class, custom_text;
    
    switch(status) {
        case -3: 
            custom_class = "error";
            custom_text = "FILESIZE";
            break;
        
        case -2:
            custom_class = "error";
            custom_text = "KO";
            break;
            
        case -1:
            custom_class = "idle";
            custom_text = "En fila";
            break;
            
        case 0:
            custom_class = "uploading";
            custom_text = "";
            break;
            
        case 1:
            custom_class = "done";
            custom_text = "OK";
            break;
    };
    
    li
    .removeClass()
    .css("background-size", "0 0")
    .addClass(custom_class)
    .find("span").eq(1)
    .text(custom_text)
    ;
    
    return li;
}

var create_li = function(name) {
    var li = $("#modele-li-queue").clone();
    
    li.find("span").first().text(name);
    li.attr("data-position", queue.length);
    li.attr("id", "");
    
    return li;
};

////////////////////////////
// Gestion des fichiers entrés dans l'input
var handle_files = function() {
    files = $("#files-handler").prop("files");
    
    $.each(files, function() {
        var file_tab = this.name.split(".");
        var extension = file_tab[file_tab.length - 1];
        
        // Si l'extension est légale, on pousse le fichier dans la queue
        if (extension in allowed_extensions) {
            var document_li = set_li_status(create_li(this.name), -1);
            queue.push({ document: this, status: -1, size: this.size, li: document_li, filename: "", displayname: this.name, store: { date: "", monde: "", last_champ: "", champs: { } , categorie: "", type_doc: { } } });
        }
    });
    
    handle_uploads();
};

