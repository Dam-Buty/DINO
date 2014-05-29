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
    
    display: function() {
        $(".admin").hide();
        $(".front-element").hide();
        $("#queue").show();    
        
        $('#mondes-top li[data-selected="1"]').attr("data-selected", 0);
    },
    
    refresh: function() {
        var time = new Date().getTime();
        console.log("Refresh XHR : " + time + "( + " + (time - profiling) + "ms)" );
        profiling = time;
        var self = this;
        
        this.uploads.length = 0;
        $.ajax({
            url: "json/queue.php",
            statusCode: {
                200: function(files) {
                    var time = new Date().getTime();
                    console.log("Retour XHR : " + time + "( + " + (time - profiling) + "ms)" );
                    profiling = time;
                    
                    $.each(files, function(i, file) {                    
//                        var time = new Date().getTime();
//                        console.log("-- Pre-init-doc : " + time + "( + " + (time - profiling) + "ms)" );
//                        profiling = time;
                        
                        var doc = Document({
                            size: file.size,
                            filename: file.filename,
                            displayname: file.displayname,
                            user: file.user,
                            date: file.date
                        }).init("processed").setStatus("uploaded");  
                                      
//                        var time = new Date().getTime();
//                        console.log("-- Pre-cluster-doc : " + time + "( + " + (time - profiling) + "ms)" );
//                        profiling = time;
                        
                        self.clusterize(doc);    
                                    
//                        var time = new Date().getTime();
//                        console.log("-- Post-cluster-doc : " + time + "( + " + (time - profiling) + "ms)" );
//                        profiling = time;
                    });  
                    
                    var time = new Date().getTime();
                    console.log("Sortie boucle : " + time + "( + " + (time - profiling) + "ms)" );
                    profiling = time;
                    
                    $("#container-loading").hide();
                    self.process();
                    if (self.count_clusters() == 0) {
                        self.animate();
                    }
                    
                    var time = new Date().getTime();
                    console.log("Sortie processing : " + time + "( + " + (time - profiling) + "ms)" );
                    profiling = time;
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
        var all_done = true;
        
        if (!this.blocked) {
            $.each(Queue.uploads, function(j, doc) {
                if (doc !== undefined) {
                    all_done = false;
                    if (doc.status == "") {
                        if (doc.size > profil.maxfilesize) {
                            doc.setStatus("toobig");
                        } else {
                            $.each(self.uploaders, function(i, uploader) {
                                if (uploader === undefined) {
                                    var all_done = true;
                                    self.uploaders[i] = doc;
                                    doc.upload(i, j);
                                    return false;
                                }
                            });
                        }
                    }
                }
            });
                
            if (all_done) {
                self.uploads.length = 0;
                var first_li = $(".cluster:first() ul li:first()");
                
                if (profil.stored == 0 && profil.uploaded == 1 & self.count_clusters() > 0) {                    
                    $("#tip-store").slideDown(function() {
                        first_li
                        .tooltipster({
                            content: $("<div>Da click aqui para clasificar un documento</div>"),
                            position: "bottom"
                        }).tooltipster("show");
                    });
                }
            }
        }
    },
    
    process: function() {
        var self = this;
        
        $.each(self.clusters, function(j, cluster) {
            var cluster_done = false;
            
            $.each(cluster.documents, function(k, doc) {
                if (doc.status != "processed") {
                    if (doc.status == "idle" || doc.status == "uploaded") {
                        if (doc.processes.length > 0) {
                            $.each(self.processers, function(i, processer) {
                                if (processer === undefined) {
                                    self.processers[i] = doc;
                                    doc.process(i);
                                    cluster_done = true;
                                    return false;
                                }
                            });
                        } else {
                            doc.setStatus("processed");
                            //self.process();
                        }
                    }
                }
            });
            
            if (cluster_done) {
                return false;
            }
        });
        
        self.throttle();
    },
    
    upload: function(element) {
        var self = this;
        
        if(typeof FileList !== 'undefined') {
            files = $(element).prop("files");
        } else { // shim for ie9
            files = {
                name: files.value,
                size: 23
            };
        }
        
        if (self.count_clusters() == 0) {
            self.animate();
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
    
    clusterize: function(doc) {
        var cluster;
        
        if (this.clusters[doc.type] === undefined) {            
            this.clusters[doc.type] = Cluster({
                type: doc.type
            }).init();
        }
        
        cluster = this.clusters[doc.type];
        
        doc.position = cluster.documents.length;
        
        doc.li.find(".bouton-del-li").click(function() {
            cluster.remove(doc.position);
            event.stopPropagation();
        });
        
        cluster.documents.push(doc);
        cluster.ul.prepend(doc.li);
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
        if ($("#container-queue").css("right") != "0px") {
            $("#container-queue").animate({
                right: 0
            });
            
            $("#tip-upload").slideUp();
        } else {
            $("#container-queue").animate({
                right: "40%"
            }, function() {
                $("#tip-upload").slideDown(function() {
                    $("#upload-buttons")
                    .tooltipster({
                        content: $("<div>Da click aqui para cargar archivos</div>"),
                        position: "left"
                    }).tooltipster("show");
                });
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
            var doc;
            var position;
            
            if (index == "all") {
                position = 0;
            } else {
                position = index;
            }
            
            doc = this.documents[position];
            
            doc.del(function() {
                self.remove_index(position);
            
                if (self.documents.length == 0) {
                    self.div.remove();
                    self.div = undefined;
                    self.ul = undefined;
                    
                    Queue.clusters[self.type] = undefined;
                } else {
                    if (index == "all") {
                        self.remove("all");
                    }
                }
            });
        },
        
        remove_index: function(index) {
            this.documents.splice(index, 1);
            
            this.renumber();
        },
        
        renumber: function() {
            $.each(this.documents, function(i, document) {
                document.position = i;
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
            date: undefined, 
            monde: undefined, 
            last_champ: undefined, 
            champs: { } , 
            categorie: undefined, 
            type_doc: undefined,
            detail: undefined
        },
        
        init: function(mode) {
            
            var li = $("#modele-li-queue").clone(true);
            var taille;
            var self = this;
            
            this.extension = this.displayname.split(".").pop().toLowerCase();
            
//            var time = new Date().getTime();
//            console.log("--- Pre-cluster-li : " + time + "( + " + (time - profiling) + "ms)" );
//            profiling = time;
            
            $.each(categories_documents, function(type, categorie) {
                if (self.extension in categorie.extensions) {
                    self.type = type;
                    if (mode === undefined) {
                        self.processes = categorie.processes.slice(0);
                    }
                }
            });
            
            if (this.type == "") {
                this.type ="xxx";
                if (mode === undefined) {
                    self.processes = categories_documents.xxx.processes.splice(0);
                }
            }
            
            li.find(".filename").text(this.displayname);
            
            
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
            
//            var time = new Date().getTime();
//            console.log("--- Post-cluster-li : " + time + "( + " + (time - profiling) + "ms)" );
//            profiling = time;
            
            return this;
        },
        
        setStatus: function(status) {
            this.status = status;
            var self = this;
              
            switch(status) {                    
                case "uploading":
                    this.li.find(".progressbar").progressbar("value", false);
                    this.li.find(".progressbar").slideDown();
                    break;
                    
                case "uploaded":
                    this.li.click(function() {
                        self.classify(self.type, self.position);
                    });
                    
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
                    this.li.find(".progressbar").slideUp();
                    this.li.find(".filename").removeClass("processing");
                    this.li.children("img").fadeIn();  
                    break;
            };
            
            return this;
        },
        
        progress: function(pourcentage) {
            this.li.find(".progressbar").progressbar("value", pourcentage);
        },
        
        upload: function(uploader, doc) {
            var upload_data = new FormData;
            var self = this;
            
            this.setStatus("uploading");
            
            upload_data.append("document", this.file);

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
//                                console.log(self.displayname + " : " + pourcentage + "%");
                                self.progress(pourcentage);
                            }
                        }, false);
                    }
                    return myXhr;
                },
                statusCode: {
                    201: function(data) {
                        Queue.uploaders[uploader] = undefined;
                        Queue.uploads[doc] = undefined;
            
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
        
        classify: function(type, position) {
            store_document(type, position);
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
    var time = new Date().getTime();
    console.log("Bootstrap queue : " + time + "( + " + (time - profiling) + "ms)" );
    profiling = time;
            
    $("#modele-li-queue").find(".progressbar").progressbar({
        max: 100,
        value: false
    });
    
    $("#zone-dnd input").unbind().change(function() {
        Queue.upload(this);
    });
    
    $("#files-button").click(function() {
        $("#files-handler").click();
    });
    
    $("#dirs-button").click(function() {
        $("#dirs-handler").click();
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
            200: function(doc) {
                $("#container-notification").show().text("Impresora virtual : Procesando " + doc.filename); // LOCALISATION
                
                $.ajax({
                    url: "do/doPack.php",
                    type: "POST",
                    data: {
                        document: doc.filename
                    },
                    statusCode: {
                        200: function() {
                            $.ajax({
                                url: "do/doReleaseDocument.php",
                                type: "POST",
                                data: {
                                    document: doc.filename
                                },
                                statusCode: {
                                    200: function() { // rajouter l'extension'
                                        var document_li = set_li_status(create_li(doc.displayname, doc.size, doc.user, doc.date), 1);
                                        doc.li = document_li;
                                        queue.push(doc);
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
//                refresh_liste();
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
};

var _remove_all_documents = function() {
}
