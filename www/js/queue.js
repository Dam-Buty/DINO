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
    "pptx": 1,
    "zip": 1,
    "rar": 1,
    "odt": 1,
    "epub": 1,
    "mobi": 1
}

var pdf_extensions =  {
    "pdf": 1,
    "ps": 1,
    "eps": 1
};

var img_extensions =  {
    "jpg": 1,
    "png": 1,
    "gif": 1,
    "jpeg": 1,
    "psd": 1,
    "ai": 1
};

var doc_extensions = {
    "doc": 1,
    "dot": 1,
    "odt": 1,
    "ott": 1,
    "sxw": 1,
    "stw": 1,
    "docx": 1,
    "dotx": 1,
    "xls": 1,
    "xlt": 1,
    "ods": 1,
    "ots": 1,
    "sxc": 1,
    "stc": 1,
    "xlsx": 1,
    "xltx": 1,
    "csv": 1,
    "odp": 1,
    "otp": 1,
    "sxi": 1,
    "sti": 1,
    "pps": 1,
    "ppt": 1,
    "ppsx": 1,
    "pptx": 1
};

var vid_extensions = {
    "mp4": 1,
    "avi": 1,
    "wmv": 1,
    "mov": 1,
    "divx": 1,
    "mkv": 1
};

var queue = [];

var uploading = [undefined, undefined, undefined];

var bootstrap_queue = function() {
    if (profil.printer != "") {
        $.ajax({
            url: "do/doCheckCave.php",
            type: "POST",
            statusCode : {
                201: function() {
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
    } else {
        get_queue(); 
    }
}

var get_queue = function() {
    queue.length = 0;
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
  if (a.status = b.status) {
    if (a.displayname < b.displayname) {
        return -1;
    }
    if (a.displayname > b.displayname) {
        return 1;
    }
    return 0;
  }
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
    // queue.sort(compare);
    
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
};

var remove_document = function() {
    var position = $(this).closest("li").attr("data-position");
    
    confirm_remove_document(position);    
};

var remove_document_store = function() {
    var position = $("#popup-store").attr("data-document");
    
    confirm_remove_document(position);    
};

var confirm_remove_document = function(position) {
    var list_element = queue[position];
    
    var titre = "Supresion de documento";
    var message = "Estas seguro de querer borrar definitivamente el documento? Es una accion <b>irreversible</b>!";
    var bouton = "Confirmar (<i>borrar el documento</i>)";
    
    popup_confirmation(message, titre, bouton, function() {
        _remove_document(position);
    });
};

var _remove_document = function(position, callback) {
    list_element = queue[position];
    
    $.ajax({
        url: "do/doRemoveFromQueue.php",
        type: "POST",
        data: {
            filename: list_element.filename
        },
        statusCode: {
            204: function() {
                if ($("#popup-store").is(":visible")) {
                    avance_store(position);
                } else {
                    queue.splice(position, 1);
                    refresh_liste();
                    
                    if (typeof callback === "function") {
                        callback();
                    }
                }
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup('Error de supresion del documento. Gracias por intentar otra vez', 'error'); // LOCALISATION
            }
        }
    });
};

var remove_all_documents = function() {
    var titre = "Supresion de " + queue.length + " documentos";
    var message = "<p>Estas a punto de borrar definitivamente los " + queue.length + " documentos de la fila de espera.</p><p>Te recuerdo que esta operacion es <b>irreversible</b>.</p>";
    var bouton = "Confirmar (<i>borrar " + queue.length + " documento</i>)";
    
    popup_confirmation(message, titre, bouton, function() {
        $("#files-list img").hide();
        _remove_all_documents();
    });
};

var _remove_all_documents = function() {
    if (queue.length > 0) {
        _remove_document(0, _remove_all_documents);
    }
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
            if (Tuto.etape == 1) {
                Tuto.next();
            }
            break;
    };
    
    
    return li;
}

var create_li = function(name, size, user, date) {
    var li = $("#modele-li-queue").clone();
    var taille;
    var extension = name.split(".").pop().toLowerCase();
    var type = "";
    
    if (extension in pdf_extensions) {
        type = "pdf";
    }
    
    if (extension in doc_extensions) {
        type = "doc";
    }
    
    if (extension in img_extensions) {
        type = "img";
    }
    
    if (extension in vid_extensions) {
        type = "vid";
    }
    
    if (type == "") {
        type ="xxx";
    }
    
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
        id: "",
        "data-filetype": type
    })
    .on("dragstart", dragstart)
    .on("dragend", dragend);
    
    return li;
};

////////////////////////////
// Gestion des fichiers entrés dans l'input
var handle_files = function(files) {

    if(typeof FileList !== 'undefined') {
        if (files instanceof FileList === false) {
            files = $("#files-handler").prop("files");
        }
    }
    
    $.each(files, function() {
        var file_tab = this.name.split(".");
        var extension = file_tab[file_tab.length - 1].toLowerCase();
        
        // Si l'extension est légale, on pousse le fichier dans la queue
//        if (extension.toLowerCase() in allowed_extensions) {
        var document_li = set_li_status(
            create_li(
                this.name, 
                this.size, 
                "usted", 
                "hoy"
            ), -1
        );
        
        queue.unshift({ 
            document: this, 
            status: -1, 
            size: this.size, 
            li: document_li, 
            filename: "", 
            displayname: this.name, 
            user: "usted", 
            date: "hoy", 
            store: { 
                date: "", 
                monde: "", 
                last_champ: "", 
                champs: { } , 
                categorie: "", 
                type_doc: { } 
            } 
        });
//        }
    });
    
    refresh_liste();
    handle_uploads();
};

