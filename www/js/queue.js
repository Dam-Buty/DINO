var allowed_extensions = {
    "pdf": 1,
    "jpg": 1,
    "png": 1
}

var queue = [];

var workers = [undefined, undefined, undefined];

///////////////////////////:
// Gestion des fichiers entrés dans l'input
var handle_files = function() {
    files = $("#files_handler").prop("files");
    
    $.each(files, function() {
        var file_tab = this.name.split(".");
        var extension = file_tab[file_tab.length - 1];
        
        // Si l'extension est légale, on pousse le fichier dans la queue
        if (extension in allowed_extensions) {
            queue.push({ name: this.name, status: 0 });
            $("#files_list").append("<li>" + this.name + " - <i>" + this.size + "</i>" + "</li>").append();
        }
    });
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
window.setInterval(assign_worker, 5000);

