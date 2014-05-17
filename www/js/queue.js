var Queue = {
    uploads: [ ],
    uploaders: [undefined, undefined, undefined],
    processers: [undefined, undefined, undefined],
    blocked: false,
    
    clusters: {},
    count_clusters: function() {
        var nb = 0;
        
        $.each(this.clusters, function(i, cluster) {
            nb++;
        });
        
        return nb;
    },
    
    refresh: function() {
        var self = this;
        
        this.uploads.length = 0;
        $.ajax({
            url: "json/queue.php",
            statusCode: {
                200: function(files) {
                    $.each(files, function(i, file) {
                        var document = Document({
                            size: file.size,
                            filename: file.filename,
                            displayname: file.displayname,
                            user: file.user,
                            date: file.date
                        }).init().setStatus("uploaded");
                        self.animate();  
                        self.clusterize(document);
                    });
                },
                403: function() {
                    window.location.replace("index.php");
                },
                500: function() {
                    popup("Erreur!", "error");
                }
            }
        });
    },
    
    throttle: function() {
        var self = this;
        
        if (!this.blocked) {
            $.each(self.uploaders, function(i, uploader) {
                if (uploader === undefined) {
                    var all_done = true;
                    
                    $.each(Queue.uploads, function(j, document) {
                        if (document !== undefined) {
                            all_done = false;
                            if (document.status == "") {
                                if (document.size > profil.maxfilesize) {
                                    document.setStatus("toobig");
                                } else {
                                    self.uploaders[i] = document;
                                    document.upload(i, j);
                                    return false;
                                }
                            }
                        }
                    });
                        
                    if (all_done) {
                        self.uploaders.length = 0;
                    }
                }
            });
        }
    },
    
    process: function() {
        var self = this;
        
        $.each(self.processers, function(i, processer) {
            if (processer === undefined) {
                $.each(self.clusters, function(j, cluster) {
                    var cluster_done = false;
                    
                    $.each(cluster.documents, function(k, document) {
                        if (document.status != "processed") {
                            if (document.status == "idle" || document.status == "uploaded") {
                                if (document.processes.length > 0) {
//                                    console.log(document.filename + " : Lancement " + document.processes[0] + " sur (" + i + ")");
                                    self.processers[i] = document;
                                    document.process(i);
                                    cluster_done = true;
                                    return false;
                                } else {
                                    document.setStatus("processed");
                                }
                            }
                        }
                    });
                    
                    if (cluster_done) {
                        return false;
                    }
                });
            }
        });
        
        self.throttle();
    },
    
    upload: function(files) {
        var self = this;
        
        if(typeof FileList !== 'undefined') {
            if (files instanceof FileList === false) {
                files = $("#files-handler").prop("files");
            }
        } else { // shim for ie9
            files = {
                name: files.value,
                size: 23
            };
        }
        
        $.each(files, function() {
            var position = self.uploads.length;
            
            if (this.name != ".") {
                self.uploads.push(
                    Document({ 
                        file: this, 
                        size: this.size, 
                        displayname: this.name,
                        position: position
                    }).init()
                );
            }
        });
        
        self.animate();
        self.throttle();
    },
    
    pause: function() {
        if (this.blocked) {
            this.blocked = false;
            this.throttle;
        } else {
            this.blocked = true;
        }
    },
    
    clusterize: function(document) {
        var cluster;
        
        if (this.clusters[document.type] === undefined) {            
            this.clusters[document.type] = Cluster({
                type: document.type
            }).init();
        }
        
        cluster = this.clusters[document.type];
        
        document.position = cluster.documents.length;
        
        document.li.find(".bouton-del-li").click(function() {
            cluster.remove(document.position);
        });
        
        cluster.documents.push(document);
        cluster.ul.append(document.li);
    },
    
    empty: function() {
        var self = this;
        var uploads = [];
        
        this.blocked = true;
        
        $.each(this.uploads, function(i, upload) {
            if (upload.status == "uploading") {
                uploads.push(upload);
            }
        });
        
        self.uploads = uploads;
        self.blocked = false;
    },
    
    cancel: function() {
        this.documents.splice(position, 1);
    },
    
    animate: function() {
        if (this.count_clusters() != 0) {
            $("#container-queue").animate({
                right: 0
            });
        } else {
            $("#container-queue").animate({
                right: "40%"
            });
        }
    }
};

var Cluster = function(options) {
    return $.extend({
        type: "",
        div: undefined,
        ul: undefined,
        documents: [],
        
        init: function() {
            var categorie = categories_documents[this.type];
            
            this.ul = $("<ul></ul>");
            this.div = $("<div></div>")
                .addClass("cluster")
                .attr("data-cluster", this.type)
                .append(
                    $("<h1></h1>")
                    .text(categorie.label)
                ).append(
                    $("<div></div>")
                    .addClass("del-all")
                    .text("Borrar todo")
                    .click(this.empty)
                ).append(
                    this.ul
                );
            
            $("#queue").append(this.div);
            
            return this;
        },
        
        empty: function() {
            var div = $(this);
            var parent = div.parent("div");
            var cluster = Queue.clusters[parent.attr("data-cluster")];
            
            queue = cluster.documents;
                        
            titre = "Supresion de " + queue.length + " documentos";
            message = "<p>Estas a punto de borrar definitivamente los " + queue.length + " documentos de la fila de espera.</p><p>Te recuerdo que esta operacion es <b>irreversible</b>.</p>";
            bouton = "Confirmar (<i>borrar " + queue.length + " documento</i>)";
            
            popup_confirmation(message, titre, bouton, function() {
                cluster.ul.find("img").hide();
                
                cluster.remove("all");
            });
        },
        
        remove: function(index) {
            var self = this;
            var document;
            var position;
            
            if (index == "all") {
                position = 0;
            } else {
                position = index;
            }
            
            document = this.documents[position];
            
            document.del(function() {
                self.documents.splice(position, 1);
            
                if (self.documents.length == 0) {
                    self.div.remove();
                    self.div = undefined;
                    self.ul = undefined;
                    
                    Queue.clusters[self.type] = undefined;
                    Queue.animate();
                } else {
                    if (index == "all") {
                        self.remove("all");
                    }
                }
            });
        }
    }, options);
};



var Document = function(options) {
    return $.extend({ 
        file: undefined, // Objet File
        li: undefined,       // Objet LI
        processes: [],
        
        position: 0,
        
        filename: "", 
        displayname: "", 
        size: "", 
        displaysize: "",
        extension: "",
        type: "",
                
        user: "", 
        date: "", 
        
        status: "", 
        store: { 
            date: "", 
            monde: "", 
            last_champ: "", 
            champs: { } , 
            categorie: "", 
            type_doc: { } 
        },
        
        init: function() {
            var li = $("#modele-li-queue").clone();
            var taille;
            var self = this;
            
            this.extension = this.displayname.split(".").pop().toLowerCase();
            
            $.each(categories_documents, function(type, categorie) {
                if (self.extension in categorie.extensions) {
                    self.type = type;
                    self.processes = categorie.processes.slice(0);
                }
            });
            
            if (this.type == "") {
                this.type ="xxx";
                self.processes = [ "pack", "remove" ];
            }
            
            li.find(".filename").text(this.displayname);
            
            li.find(".progressbar").progressbar({
                max: 100,
                value: false
            });
            
            this.displaysize = this.size + " o";
            
            if (this.size > 103) {
                this.displaysize = (this.size / 1024).toFixed(2) + " Ko";
            }
            
            if (this.size > 524288) {
                this.displaysize = (this.size / 1048576).toFixed(2) + " Mo";
            }
            
            li.find(".details-queue")
                .append("<i>" + this.displaysize + "</i>")
                .append(". Subido por <b>" + this.user + "</b> " + this.date + ".")    
            ;
            
            li.attr({
                id: "",
                "data-filetype": this.type
            });
//            .on("dragstart", dragstart)
//            .on("dragend", dragend);

            $("#files-list").append(li);
            
            this.li = li;
            
            return this;
        },
        
        setStatus: function(status) {
            this.status = status;
              
            switch(status) {                    
                case "uploading":
                    this.li.find(".progressbar").progressbar("value", false);
                    this.li.find(".progressbar").slideDown();
                    break;
                    
                case "uploaded":
                    this.li.find(".progressbar").slideUp();
                    this.li.children("img").fadeIn();  
                    
                    Tuto.flag(1);
                    break;
                
                case "toobig":
                    this.li.addClass("toobig");
                    break;
                    
                case "processing":
                    this.li.find(".filename").addClass("processing");
                    break;
                    
                case "idle":
                    this.li.find(".filename").removeClass("processing");
                    break;
                    
                case "processed":
                    this.li.find(".filename").removeClass("processing");
                    break;
            };
            
            return this;
        },
        
        progress: function(pourcentage) {
            this.li.find(".progressbar").progressbar("value", pourcentage);
        },
        
        upload: function(uploader, document) {
            var upload_data = new FormData;
            var self = this;
            
            this.setStatus("uploading");
            
            upload_data.append("document", this.file);
            Queue.animate();

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
                                console.log(self.displayname + " : " + pourcentage + "%");
                                self.progress(pourcentage);
                            }
                        }, false);
                    }
                    return myXhr;
                },
                statusCode: {
                    201: function(data) {
                        Queue.uploaders[uploader] = undefined;
                        Queue.uploads[document] = undefined;
            
                        self.setStatus("uploaded");
                        self.filename = data.filename;
                        
                        if (profil.uploaded == 0) {
                            profil.uploaded = 1;
                            
                            $.ajax({
                                url: "do/doFirstUpload.php",
                                type: "POST",
                                data: { },
                                statusCode: {
                                    200: function(data) {
                                        mixpanel.track("upload", {});   
                                    },
                                    403: function() {
                                        window.location.replace("index.php");
                                    },
                                    500: function() {
                                        popup("Erreur!", "error");
                                    }
                                }
                            });
                        }
                        
                        Queue.clusterize(self);
                        Queue.throttle();
                        Queue.process();
                    },
                    403: function() {
                        window.location.replace("index.php");
                    },
                    500: function() {
                        Queue.uploaders[uploader] = undefined;
                        self.setStatus(-2);
                        Queue.throttle();
                    }
                }
            });
        },
        
        process: function(processer) {
            var action = this.processes[0];
            var self = this;
            
//            console.log(this.filename + " : " + JSON.stringify(this.processes));
            
            self.setStatus("processing");
            
            $.ajax({
                url: "do/doProcess.php",
                type: "POST",
                data: {
                    action: action,
                    document: self.filename
                },
                statusCode: {
                    200: function() {
                    
                        Queue.processers[processer] = undefined;
                        self.processes.shift();
                        
//                        console.log(self.filename + " : Retour " + action + " sur (" + processer + ")");
//                        console.log(self.filename + " : " + JSON.stringify(self.processes));
                        
                        self.setStatus("idle");
                        Queue.throttle();
                        Queue.process();
                    },
                    500: function() {
                        Queue.processers[processer] = undefined;
                        self.setStatus("error");
                        Queue.throttle();
                        Queue.process();
                    }
                }
            });
        },
        
        del: function(callback) {
            var self = this;
            
            $.ajax({
                url: "do/doRemoveFromQueue.php",
                type: "POST",
                data: {
                    filename: self.filename
                },
                statusCode: {
                    204: function() {
                        self.li.remove();
                        self.li = undefined;
                        
                        if (callback !== undefined) {
                            callback();
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
        }
        
    }, options);
};


var bootstrap_queue = function() {
    $("#files-handler").unbind().change(function(files) {
        Queue.upload(files);
    });
    
    if (profil.printer != "") {
        $.ajax({
            url: "do/doCheckCave.php",
            type: "POST",
            statusCode : {
                201: function() {
                    //get_queue();
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
        Queue.refresh();
    }
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
                                    200: function() { // rajouter l'extension'
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
                //$("#container-notification").fadeOut();
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

var anime_queue = function() {
    if (!$("#menu-queue").hasClass("inactive")) {
        if ($("#container-queue").attr("data-state") == "closed") {
            $("#container-queue").animate({ width: "25%", left: "50px" });
            $("#core").animate({ "padding-left": "+=25%" });
            $("#container-queue").attr({ "data-state": "open" });
        } else {
            $("#container-queue").animate({ width: "", left: "" });
            $("#core").animate({ "padding-left": "-=25%" });
            $("#container-queue").attr({ "data-state": "closed" });
        }
    }
}

var refresh_liste = function() {
    
    $("#del-all").text("Borrar " + queue.length + " documentos");
    
    $("#files-list li").detach();
    
    $.each(queue, function(i, document) {
        $("#files-list").append(queue[i].li.attr("data-position", i));
    });
    
    $("#files-list li").unbind().click(store_document);
    $(".bouton-del-li").unbind().click(remove_document);
};

var remove_document = function(event) {
    var position = $(this).closest("li").attr("data-position");
    
    event.stopPropagation();
    
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
};

var remove_all_documents = function() {
//    var div = $(this);
//    var parent = div.parent("div");
//    var queue, titre, message, bouton;
//    
//    if (parent.hasClass("cluster")) {
//    } else {
//        $.each(Queue.uploads, function(i, upload))
//    }
    
    
};

var _remove_all_documents = function() {
    if (queue.length > 0) {
        _remove_document(0, _remove_all_documents);
    }
}
