var Mentorial = function(Scenarios, options) {
    return $.extend({
        // Config
        stages_container: "#container-tuto",
        css_prefix: "etape",
        substitution_prefix: "tuto-",
        exit_image: "img/exit_50.png",
        button_next: ".next",
        opaque: true,
        exit_on_opaque: true,
        exit_callback: function() {},
        z_opaque: 700,
        z_highlight: 701,
        css_border: "2px solid #DB7F1A",
        
        // Données persistentes entre les étapes
        Scenarios: Scenarios,
        data: { 
            substitutions: { }
        },
        flag_value: undefined,
        
        // Données locales d'étape
        highlights: [ ],
        borders: [ ],
        tooltips: [ ],
        
        // Variables de navigation
        scenario: 0,
        stage: 0,
        
        // Exécute un scénario
        run: function(scenario){        
            this.data = {};
            this.flag_value = undefined;
            this.highlights = [ ];
            this.borders = [ ];
            this.tooltips = [ ];
            this.scenario = scenario;
            this.stage = 0;
            
            // Fond opaque et bouton exit
            if (this.opaque) {
                $("body").append(
                    $("<div></div>")
                    .attr("id", "opak-tuto")
                    .css("z-index", this.z_opaque)
                    .append(
                        $("<div></div>")
                        .addClass("boutons")
                        .attr("id", "quit-tuto")
                        .append(
                            $("<img/>")
                            .attr("src", this.exit_image)
                        )
                    )
                );
            }
            
            var self = this;
            
            $(this.stages_container).fadeIn();
            $("#quit-tuto").unbind().click(function() {
                self.exit();
            });
            
            if (this.exit_on_opaque) {
                $("#opak-tuto").unbind().click(function() {
                    self.exit();
                });
            }
            
            $(this.button_next).unbind().click(function() {
                self._next();
            });
            this._show();
        },
        
        // Sortie du tutorial
        exit: function() {
            this._clean();
            $(this.stages_container).fadeOut();
            $("#opak-tuto").remove();
            this.exit_callback();
        },
        
        // Affichage et clean des étapes
        _show: function() {
            var current = this.Scenarios[this.scenario].stages[this.stage];
            
            $("#" + this.css_prefix + "-" + this.scenario + "-" + this.stage)
            .css(current.stage_css)
            .fadeIn();
            
            if (current.raises_flag) {
                this.flag("raise");
            }
            
            this.highlights = [ ];
            this.borders = [ ];
            this.tooltips = [ ];
            
            this._animations($.merge([], current.animations));
            
            if (current.substitutions !== undefined) {
                this._substitutions(current.substitutions());
            }
        },
        _clean: function() {
            var current = this.Scenarios[this.scenario].stages[this.stage];
            $("." + this.css_prefix).fadeOut();
            
            this._highlights_clean();
            this._borders_clean();
            this._tooltips_clean();
            
            if (current.clean !== undefined) {
                current.clean();
            }
        },
        
        // Navigation
        _next: function() {
            
            this._clean();
            if (this.stage < this.Scenarios[this.scenario].stages.length - 1) {
                this.stage = this.stage + 1;
                this._show();
            } else {
                this.exit();
            }
        },
        _prev: function() {
            this._clean();
            this.stage = this.stage - 1;
            this._show();
        },
        
        // Gestion du flag
        flag: function(action) {
            switch(action) {
                case "raise":
                    this.flag_value = this.stage;
                    break;
                case "drop":
                    this.flag_value = undefined;
                    break;
                default:
                    if (this.flag_value === this.stage) {
                        this.flag("drop");
                        this._next();
                    }
            }
            return this.flag_value;
        },
        
        // Gestion des animations
        _animations: function(list) {
            animation = list.shift(); // Retire le premier élément du tableau
            var self = this;
            setTimeout(function() {
                switch(animation.type) {
                    case "code":
                        animation.code();
                        break;
                    case "highlight":
                    
                        var highlight = {
                            element: $(animation.selector),
                            forced: animation.force,
                            parent: undefined,
                            sibling: undefined
                        };
                        
                        $(animation.selector).css("z-index", self.z_highlight);
                        
                        if (animation.force) {
                            // On récupère ses coordonées
                            var element = $(animation.selector);
                            var left = element.offset().left;
                            var top = element.offset().top;
                            
                            var width = element.outerWidth();
                            var height = element.outerHeight();
                            
                            // Pour pouvoir replacer l'élément par la suite, on repère son parent et son sibling
                            highlight.parent = element.parent();
                            if (element.prev().length == 0) {
                                highlight.sibling = false;
                            } else {
                                highlight.sibling = element.prev();
                            }

                            element.detach();
                            $("body").append(element);
                            element.css({
                                position: "absolute",
                                top: top,
                                left: left,
                                width: width + "px",
                                height: height + "px",
                                margin: 0
                            });
                        }
                            
                        self.highlights.push(highlight);
                        break;
                    case "border":
                        self.borders.push($(animation.selector));
                        $(animation.selector).css("border", self.css_border);
                        break;
                    case "tooltip":
                        self.tooltips.push($(animation.selector));
                        $(animation.selector)
                        .tooltipster(animation.options)
                        .tooltipster("show");
                        break;
                }
                
                if (list.length > 0) {
                    self._animations(list);
                }
            }, animation.delay || 0);
        },
        
        // Gestion des substitutions de texte
        _substitutions: function(substitutions) {
            $.extend(this.data.substitutions, substitutions);
            
            $.each(substitutions, function(key, value) {
                $("." + this.substitution_prefix + key).html(value);
            })
        },
        
        // Nettoyage des animations d'une étape
        // - Highlights
        _highlights_clean: function() {
            $.each(this.highlights, function(i, highlight) {
                highlight.element.css("z-index", "");
                if (highlight.forced) {
                    if (highlight.sibling === false) {
                        highlight.parent.append(highlight.element);
                    } else {
                        highlight.sibling.after(highlight.element);
                    }
                    
                    highlight.selector.css({
                        position: "",
                        top: "",
                        left: "",
                        margin: "",
                        width: "",
                        height: ""
                    });
                }
            });
        },
        
        _borders_clean: function() {
            $.each(this.borders, function(i, element) {
                element.css("border", "");
            });
        },
        
        _tooltips_clean: function() {
            $.each(this.tooltips, function(i, element) {
                element.tooltipster("destroy");
            });
        }
    }, options);
};