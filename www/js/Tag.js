var Tag = {
    id: "",
    
    domain: "",
    
    init: function(options) {
        this.domain = location.hostname.split(".").shift();
        this.id = options.id || "";
        
        this.pixels.keychain = this.keychains[this.domain];
        var self = this;
        
        $.each(options.tags || [], function(i, tag) {
            if (self.pixels.keychain[tag] != "") {
                self.pixels[tag](self.id);
            }
        });
        
        if (options.callback !== undefined) {
            options.callback();
        }
    },

    keychains: {
        my: {
            pa: "537152def7883fa781000018",
            mp: "869166a4cc76c76e609d760f484a2883",
            ga: "UA-46251879-1"
        },
        baby: {
            pa: "",
            mp: "6e55051c7ccd519d877791cf454ced7b",
            ga: "UA-46251879-2"
        },
        localhost: {
            pa: "",
            mp: "46582f9cfff2a4829acfc86efda788cf",
            ga: ""
        }
    },
    
    pixels: {
        keychain: undefined,
        
        pa: function(id) {
            var self = this;
            (function() {
                window._pa = window._pa || {};
                var pa = document.createElement('script'); pa.type = 'text/javascript'; pa.async = true;
                pa.src = ('https:' == document.location.protocol ? 'https:' : 'http:') + "//tag.perfectaudience.com/serve/" + self.keychain.pa + ".js";
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(pa, s);
            })();
        },
        
        mp: function(id) {
            (function(e,b){
                if(!b.__SV){var a,f,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.track_charge people.clear_charges people.delete_user".split(" ");
        for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src=("https:"===e.location.protocol?"https:":"http:")+'//cdn.mxpnl.com/libs/mixpanel-2.2.min.js';f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f)}
            })(document,window.mixpanel||[]);
            
            mixpanel.init(this.keychain.mp);
            
            if (id != "") {
                mixpanel.identify(id);
            }
        },
        
        ga: function(id) {
            (function(i,s,o,g,r,a,m){
                i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

            ga('create', this.keychain.ga, 'dino.mx');
        }
    }
};
