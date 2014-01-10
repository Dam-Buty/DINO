var allowed_extensions = {
    "pdf": 1,
    "jpg": 1,
    "png": 1,
    "gif": 1,
    "doc": 1,
    "xls": 1,
    "ppt": 1,
    "docx": 1,
    "xlsx": 1,
    "pptx": 1
}

var img_extensions =  {
    "jpg": 1,
    "png": 1,
    "gif": 1
};

var queue = [];

var uploading = [undefined, undefined, undefined];

var bootstrap_queue = function() {
    $.ajax({
        url: "do/doCheckCave.php",
        type: "POST",
        statusCode : {
            200: function() {
                get_queue();
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup("Error! Gracias por intentar otra vez...", "error");
            }
        }
    });
}

var get_queue = function() {
    $.ajax({ url: "json/queue.php" })
    .done(function (data) {
        $.each(data.queue, function() {
            var document_li = set_li_status(create_li(this.displayname, this.size, this.user, this.date), 1);
            this.li = document_li;
            queue.push(this);
        });
        refresh_liste();
        clean_cave();
    });
    
    $("#files-handler").unbind().change(handle_files);
}

// - Demande un document dans la cave.
//      - le script marque le document en statut 888 pour pas qu'il se fasse attraper
//        par qqn d'autre
//      - on reçoit un filename qu'on envoie au packer
//      - quand c'est packé on release le document
// - et on repart en demander un nouveau
var clean_cave = function() {
    $.ajax({
        url: "do/doRequestDocument.php",
        type: "POST",
        statusCode : {
            200: function(document) {
                $("#container-notification").show().text("Impresora virtual : Procesando " + document.filename); // LOCALISATION
                
                $.ajax({
                    url: "do/doPack.php",
                    type: "POST",
                    data: {
                        document: document.filename
                    },
                    statusCode: {
                        200: function() {
                            $.ajax({
                                url: "do/doReleaseDocument.php",
                                type: "POST",
                                data: {
                                    document: document.filename
                                },
                                statusCode: {
                                    200: function() {
                                        var document_li = set_li_status(create_li(document.displayname, document.size, document.user, document.date), 1);
                                        document.li = document_li;
                                        queue.push(document);
                                        clean_cave();
                                    },
                                    500: function() {
                                        popup("Error! Gracias por intentar otra vez...", "error");
                                    }
                                }
                            });
                        },
                        500: function() {
                            popup("Error! Gracias por intentar otra vez...", "error");
                        }
                    }
                });
            },
            204: function() {
                $("#container-notification").fadeOut();
                refresh_liste();
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup("Error! Gracias por intentar otra vez...", "error");
            }
        }
    })
}


var compare = function(a,b) {
  if (a.status > b.status)
     return 1;
  if (a.status < b.status)
    return -1;
  return 0;
}

var anime_queue = function() {
    if ($("#container-queue").attr("data-state") == "closed") {
        $("#container-queue").animate({ left: "10%" });
        $("#core").animate({ left: "35%", width: "65%" });
        $("#container-queue").attr({ "data-state": "open" });
    } else {
        $("#container-queue").animate({ left: "-18%" });
        $("#core").animate({ left: "10%", width: "90%" });
        $("#container-queue").attr({ "data-state": "closed" });
    }
}

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
                        var li = list_element.li;
                        
                        li.find(".progressbar").progressbar("value", pourcentage);
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
                document_li.find(".progressbar").progressbar("value", false);
                
                $.ajax({
                    url: "do/doPack.php",
                    type: "POST",
                    data: {
                        document: queue[queue_position].filename
                    },
                    statusCode: {
                        200: function() {
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
    
    console.log(uploading);
    
    $.each(uploading, function(i, uploader) {
        if (uploader === undefined) {
            $.each(queue, function(j, document) {
                if (document.status == -1) {
                    if (document.size > profil.maxfilesize) {
                        queue[j].status = -3;
                        set_li_status(queue[j].li, -3);
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
            break;
        
        case -2:
            break;
            
        case -1:
            break;
            
        case 0:
            li.find(".progressbar").progressbar("value", false);
            li.find(".progressbar").slideDown();
            break;
            
        case 1:
            li.find(".progressbar").slideUp();
            li.children("img").fadeIn();
            break;
    };
    
    
    return li;
}

var create_li = function(name, size, user, date) {
    var li = $("#modele-li-queue").clone();
    var taille;
    
    li.find(".filename").text(name);
    
    li.find(".progressbar").progressbar({
        max: 100,
        value: false
    });
    
    taille = size + " o";
    
    if (size > 103) {
        taille = (size / 1024).toFixed(2) + " Ko";
    }
    
    if (size > 524288) {
        taille = (size / 1048576).toFixed(2) + " Mo";
    }
    
    li.find(".details-queue")
        .append("<i>" + taille + "</i>")
        .append(". Subido por <b>" + user + "</b> " + date + ".")    
    ;
    
    li.attr({
        "data-position": queue.length,
        id: ""
    })
    .on("dragstart", dragstart)
    .on("dragend", dragend);
    
    return li;
};

////////////////////////////
// Gestion des fichiers entrés dans l'input
var handle_files = function(files) {
    if (files instanceof FileList === false) {
        files = $("#files-handler").prop("files");
    }
    
    $.each(files, function() {
        var file_tab = this.name.split(".");
        var extension = file_tab[file_tab.length - 1];
        
        // Si l'extension est légale, on pousse le fichier dans la queue
        if (extension in allowed_extensions) {
            var document_li = set_li_status(create_li(this.name, this.size, "usted", "hoy"), -1);
            queue.push({ document: this, status: -1, size: this.size, li: document_li, filename: "", displayname: this.name, user: "usted", date: "hoy", store: { date: "", monde: "", last_champ: "", champs: { } , categorie: "", type_doc: { } } });
        }
    });
    
    refresh_liste();
    handle_uploads();
};

