// IE6+SSL fix courtesy of http://www.tribalogic.net/

;
(function(window) {
    try {
        var document = window.document;
        var undefined; // make sure nobody redefines window or undefined on us
        AgentBotBox = {

            /*
          PUBLIC API

          Methods in the public API can be used as callbacks or as direct calls. As such,
          they will always reference "AgentBotBox" instead of "this."
      */

            /*
       *  Build and render the AgentBotBox tab and build the frame for the AgentBotBox overlay,
       *  but do not display it.
       *  @see AgentBotBox._settings for options
       *  @param {Object} options
       */
            init: function(options) {
                try {
                    var self = AgentBotBox;
                    self._configure(options);
                    if (!self._settings.url) {
                        if (typeof(console) !== 'undefined' && console != null) {
                            console.warn("Zendesk Dropbox must be configured with a URL.");
                        }
                    } else {
                        self._initOverlay();
                        self._initTab();
                    }
                } catch(err) {
                    if (typeof(console) !== 'undefined' && console != null) {
                        console.error("Error initializing AgentBotBox: " + err + '.');
                    }
                }
            },

            /*
       *  Render the AgentBotBox. Alias for #show.
       *  @see #show
       */
            render: function(event) {
                return AgentBotBox.show(event);
            },

            /*
       *  Show the AgentBotBox. Aliased as #render.
       *  @params {Event} event the DOM event that caused the show; optional
       *  @return {false} false always, in case users want to bind it to an
       *                  onclick or other event and want to prevent default behavior.
       */
            show: function(event) {
                try {
                    var self = AgentBotBox;
                    self._render();
                    var overlay = AgentBotBox._overlay();
                    overlay.style.height = document.getElementById('agentbotbox_screen').style.height = self._getDocHeight() + 'px';
                    document.getElementById('agentbotbox_main').style.top = self._getScrollOffsets().top + 50 + 'px';
                    overlay.style.display = "block";
                    return self._cancelEvent(event);
                } catch(err) {
                    if (typeof(console) !== 'undefined' && console != null) {
                        console.error("Error showing AgentBotBox: " + err + '.');
                    }
                    return false;
                }
            },

            /*
       *  Hide the AgentBotBox.
        *  @params {Event} event the DOM event that caused the show; optional
        *  @return {false} false always, in case users want to bind it to an
        *                  onclick or other event and want to prevent default behavior.
        */
            hide: function (event){
                try {
                    AgentBotBox._overlay().style.display = 'none';
                    return AgentBotBox._cancelEvent(event);
                } catch(err) {
                    if (typeof(console) !== 'undefined' && console != null) {
                        console.error("Error hiding AgentBotBox: " + err + '.');
                    }
                    return false;
                }
            },

            showPlan: function (event){
                try {
                    document.getElementById('agentbotbox_main').style.width = '639px';
                    return AgentBotBox._cancelEvent(event);
                } catch(err) {
                    if (typeof(console) !== 'undefined' && console != null) {
                        console.error("Error show plan: " + err + '.');
                    }
                    return false;
                }
            },
            hidePlan: function (event){
                try {
                    document.getElementById('agentbotbox_main').style.width = '458px';
                    return AgentBotBox._cancelEvent(event);
                } catch(err) {
                    if (typeof(console) !== 'undefined' && console != null) {
                        console.error("Error show plan: " + err + '.');
                    }
                    return false;
                }
            },
            showMap: function (event){
                try {
                    document.getElementById('agentbotbox_main').style.width = '779px';
                    return AgentBotBox._cancelEvent(event);
                } catch(err) {
                    if (typeof(console) !== 'undefined' && console != null) {
                        console.error("Error show plan: " + err + '.');
                    }
                    return false;
                }
            },
            hideMap: function (event){
                try {
                    document.getElementById('agentbotbox_main').style.width = '458px';
                    return AgentBotBox._cancelEvent(event);
                } catch(err) {
                    if (typeof(console) !== 'undefined' && console != null) {
                        console.error("Error show plan: " + err + '.');
                    }
                    return false;
                }
            },

            /*
          PRIVATE API

          Methods in the private API should only be called by AgentBotBox itself. As such, they
          can refer to "this" instead of "AgentBotBox."
      */

            _settings: {
                assetHost:      "http://192.168.0.3/fiat/Luigi%20%20-%20Web%20Fiat/Desarrollo/",

                tab_id:         "agentbot-chat",
                tabText:        "Chat", // most browsers will use the tab_id image rather than this text
                tab_color:      "#000000",
                hide_tab:       false
            // the remaining settings are optional and listed here so users of the library know what they can configure:
            },

            _configure: function(options) {
                var prop;
                var self = this;
                for (prop in options) {
                    if (options.hasOwnProperty(prop)) {
                        self._settings[prop] = options[prop];
                    }
                }
                self._prependSchemeIfNecessary('url');
                self._prependSchemeIfNecessary('assetHost');
            },

            _prependSchemeIfNecessary: function(urlProperty) {
                var url = this._settings[urlProperty];
                if (url && !(this._urlWithScheme.test(url))) {
                    this._settings[urlProperty] = document.location.protocol + "//" + url;
                }
            },

            // @api private
            _cancelEvent: function(e) {
                var event = e || window.event || {};
                event.cancelBubble = true;
                event.returnValue = false;
                event.stopPropagation && event.stopPropagation();
                event.preventDefault && event.preventDefault();
                return false;
            },

            _urlWithScheme: /^([a-zA-Z]+:)?\/\//,

            _initOverlay: function() {
                var div  = document.createElement('div');
                div.setAttribute('id', 'agentbotbox_overlay');
                div.style.display = 'none';
                div.innerHTML = '&nbsp;';

                document.body.appendChild(div);
            },

            _initTab: function() {
                if (this._settings.hide_tab) {
                    return;
                }

                this._createTabElement();

                var tab_src = this._settings.assetHost + "/imgs/button.png";
                var arVersion = window.navigator && window.navigator.appVersion.split("MSIE");
                var version = parseFloat(arVersion[1]);
                if ((version >= 5.5) && (version < 7) && (document.body.filters)) {
                    document.getElementById('agentbotbox_tab').style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + tab_src + "', sizingMethod='crop')";
                } else {
                    document.getElementById('agentbotbox_tab').style.backgroundImage = 'url(' + tab_src + ')';
                }
            },

            _createTabElement: function() {
                var tab = document.createElement('a');
                tab.setAttribute('id', 'agentbotbox_tab');
                tab.setAttribute('href', '#');
                tab.innerHTML = this._settings.tabText;

                //tab.style.backgroundColor = this._settings.tab_color;
                //tab.style.borderColor = this._settings.tab_color;

                tab.onclick = AgentBotBox.show;

                document.body.appendChild(tab);
            },

            _getDocHeight: function(){
                return Math.max(
                    Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
                    Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
                    Math.max(document.body.clientHeight, document.documentElement.clientHeight)
                    );
            },

            _getScrollOffsets: function(){
                var result = {};
                result.left = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
                result.top = window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop;
                return(result);
            },

            _overlay: function() {
                return document.getElementById('agentbotbox_overlay');
            },

            _render: function() {
                if (this.is_rendered) {
                    return;
                }
                this.is_rendered = true;
                this._overlay().innerHTML = this._overlayContent();
                var iframe = document.getElementById('agentbotbox_iframe');
                if (iframe.attachEvent) { // IE
                    iframe.attachEvent("onload", this._iFrameLoaded);
                } else if (iframe.addEventListener) { // Mozilla
                    iframe.addEventListener("load", this._iFrameLoaded, false);
                }
            },

            _iFrameLoaded: function() {
                document.getElementById('overlay_loading').style.display = "none";
                document.getElementById('agentbotbox_iframe').style.display = "block";
            },

            _overlayContent: function(title, text, iFrameURL) {
                return '' +
                '<div id="agentbotbox_main">' +
                '<a href="javascript:void(0)"  onclick="return AgentBotBox.hide();" class="close">x</a>' +
                '<div id="overlay_loading">' +
                '<img src="' + this._settings.assetHost + '/imgs/loading.gif" />'+
                '</div>' +
                '<div id="agentbotbox_content">' +
                '<iframe src="' + this._iFrameURL() + '" id="agentbotbox_iframe" frameborder="0" scrolling="no" allowTransparency="true" style="border:0;"></iframe>' +
                '</div>' +
                '</div>' +
                '<div id="agentbotbox_screen" onclick="return AgentBotBox.hide();" ></div>';
            },

            _iFrameURL: function() {
                var i_url = this._settings.url + "/box.php?x="+Math.round(Math.random()*99999);
                if (window.location) {
                    i_url += "&page=" + encodeURIComponent(window.location.href);
                    //i_url += "&applicationID=" + this._settings.applicationID;
                }
                return i_url;
            }
        };

        if (window.agentbotbox_params) {
            AgentBotBox.init(window.agentbotbox_params);
        }
    } catch(err) {
        if (typeof(console) !== 'undefined' && console != null) {
            console.error("Error defining AgentBotBox: " + err + '.');
        }
    }
})(this.window || this);
