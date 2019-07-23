/*!
  * brogit v1.19.7 (https://brogit.de/)
  * 2017-2019 Copyright (c) brogit
  * Requirements: jQuery 3
  */

var boottime = (new Date()).getTime();

/*IE Workaround*/
var baseOrigin = document.baseURI;
if(!baseOrigin) {
    baseTags = document.getElementsByTagName('base');
    baseOrigin = (baseTags.length ? baseTags[0].href : document.URL);
}

var client = new Client(baseOrigin) || {};

function Client(origin)
{
    this.origin = origin;
    this.request = {
        dataType: 'json',
        url: this.origin,
    };

    this.status = 'init';

    $(window).scroll(function() {
        $(".client-reloader").each(client_reloader);
    });

    var Crequest = 0;
    var Cresponse = 0;

    if(this.origin != location.origin)
    {
        this.request.xhrFields = { withCredentials: true };
        this.request.crossDomain = true;
    }

    //mode = GET, POST, PUT, DELETE
    this.xhr = function(mode, route, data, callback)
    {
        //UPDATE. Check for undefined
        Crequest++;
        this.checkloading();
        $.ajax($.extend( {}, this.request, {
            type: mode,
            url: this.origin+route,
            data: data,
            success: function(resultdata, textStatus, jqXHR) {
                callback(resultdata, data, textStatus, jqXHR);
            },
            error: function(resultdata, textStatus, jqXHR) {
                callback(resultdata, data, textStatus, jqXHR);
            },
            complete: function(jqXHR, textStatus) {
                Cresponse++;
                client.checkloading();
            }
        } ) );
    }

    this.loxhrStorage = new Array();

    this.loxhr = function(mode, route, data, callback, containerElement) {
        if(!containerElement.hasClass('client-reloader') && !this.loxhrStorage[containerElement]) {
            containerElement.addClass('client-reloader');

            //preperate data to work
            data.limit = 10;
            data.offset = 0;

            //prepare callback
            var prepared_callback = function(resultdata, data, textStatus, jqXHR) {
                callback(resultdata, data, textStatus, jqXHR);

                if(lodata = client.loxhrStorage[containerElement]) {
                    lodata.data.offset += lodata.data.limit;
                    if(textStatus == 'success') {
                        lodata.status = "ready";
                    }
                    else {
                        lodata.status = "error";
                    }
                }
                else {
                    console.error("Element not in storage.");
                }

                $(".client-reloader").each(client_reloader);
            }           

            this.loxhrStorage[containerElement] = {
                status: "ready",
                mode: mode,
                route: route,
                data: data,
                callback: prepared_callback
            };
        }

        this.loxhr_reload(containerElement);
    }

    this.loxhr_reload = function(containerElement) {
        if(data = this.loxhrStorage[containerElement]) {
            if(data.status == "ready") {
                data.status = "load";
                this.xhr(data.mode, data.route, data.data, data.callback);
            }
        }
    }

    function client_reloader() {
        var pos = $(this).offset().top + $(this).height();
        var winBottom = $(window).scrollTop() + $(window).height();
        
        if (winBottom > pos) {
            client.loxhr_reload($(this));
        }
    }

    //UPDATE this 26.03.2019, deprecated
/*    this.upload = function(formelement, route, callback) {
        if(typeof(FormData) == 'undefined') {
            console.error("Cant use XHR Upload");
            return true;
        }

        var form = new FormData();
        var files = formelement.find('input[type="file"]').prop('files');

        $.each(files, function(key, value)
        {
            form.append(key, value);
        });

        Crequest++;
        this.checkloading();
        $.ajax($.extend( {}, this.request, {
            type: 'POST',
            url: route,
            cache : false,
            contentType: false,
            processData: false,
            mimeType:"multipart/form-data",
            data: form,
            xhr: function(){
                //upload Progress
                var xhr = $.ajaxSettings.xhr();
                if (xhr.upload) {
                    xhr.upload.addEventListener('progress', console.log, true);
                }
                return xhr;
            },
            complete: function (result) {
                Cresponse++;
                client.checkloading();
                callback(result);
            }
        } ) );
    }*/

    this.upload = function(file, callback) {
        var route = "api/file";

        if(typeof(FormData) != 'undefined')
        {
            var form = new FormData();
            //form.append('path', '/');
            //form.append('file[]', file);
            form.append('file', file);
        }

        $.ajax($.extend( {}, this.request, {
                type: 'POST',
                url: this.origin+route,
                cache : false,
                contentType: false,
                processData: false,
                mimeType:"multipart/form-data",
                data: form,
                xhr: function(){
                    //upload Progress
                    var xhr = $.ajaxSettings.xhr();
                    if (xhr.upload) {
                        xhr.upload.addEventListener('progress', callback.progress, true);
                    }
                    return xhr;
                },
                complete: callback.complete
        } ) );
    }

    //data id:pass
    this.basicauth = function(key, data, callback)
    {
        $.ajax($.extend( {}, this.request, {
            type: 'GET',
            data: key,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Basic ' + btoa(data));
            }
        } ) ).done(callback);
    }

    /**
    * Callback queue
    * User can decide to run this queue after some responding things
    * Used by WebControl for Minecraft: Auth
    */
    var cbQueue = new Array();
    this.cbadd = function(callback)
    {
        //check if callable
        if(typeof(callback) == 'function') {
            cbQueue.push(callback);
            return true;
        }
        else {
            console.error("'callback' is not a function");
            return false;
        }
    }

    this.cbdo = function() {
        for (var i = cbQueue.length - 1; i >= 0; i--) {
            cbQueue[i]();
        }

        //Kill the queue after Execution
        this.cbQueue = new Array();
    }

    this.checkloading = function()
    {
        if((Crequest != Cresponse) && this.status != 'load')
        {
            this.status = 'load';
            this.loadCallback();
        }
        else if(Crequest == Cresponse) {
            this.status = 'ready';
            this.readyCallback();
        }
    }

    this.loadCallback = function()
    {
        $('main').append('<div class="load"><div class="sk-folding-cube"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div></div>');
    }

    this.readyCallback = function()
    {
        $('.load').fadeOut( 1000, function() { $(this).remove(); });
    }

    this.ai = new ClientResponse() || {};
}

function ClientResponse() {

    //text_response_element = resp
    var resp = null;
    var container = null;
    var xhr_route = null;
    var me = this;

    //context stack for data
    var requestData = [];
    var responseData = [];
    var templates = {};
    var callStack = [];
    var callPosition;

    //config
    var delay_short = 500;
    var delay_long = 1000;

    this.init = function(route) {
        resp = $('<div class="display-4 my-2 text-center response-text"></div>');
        resp.hide();

        container = $('.container-response');

        container.append(resp);

        xhr_route = route;
    }

    this.setRoute = function(route) {
        xhr_route = route;
    }

    //UPDATE allow multi text and functions
    //autodelay by text length
    this.say = function(text, nextCallback, param_delay_long) {
        nextCallback = nextCallback || function() {};
        my_delay_long = param_delay_long || delay_long;

        resp.text(text);
        resp.fadeIn().delay(this.autodelay(text)).fadeOut(my_delay_long, nextCallback);
    }

    this.choice = function(text, nextCallback, param_delay_short) {
        nextCallback = nextCallback || function() {};
        my_delay_short = param_delay_short || delay_short;

        resp.text(text);
        resp.fadeIn().delay(my_delay_short).fadeIn(0, nextCallback);
    }

    this.addTemplate = function(templateSelector, beforeCallback) {
        beforeCallback = beforeCallback || function() {};

        var element = $($(templateSelector).html());
        element.hide();

        if(element.hasClass('was-validated') && element.hasClass('disable-submit')) {
            var submit = element.find(':submit');

            submit.attr('disabled', true);

            element.on('keyup', function( e, data ) {
                if (this.checkValidity() === false) {
                    submit.attr('disabled', true);
                }
                else {
                    submit.attr('disabled', false);
                }
            });
        }

        //callback work before show
        beforeCallback(element);

        container.append(element);
        element.fadeIn();

        templates[templateSelector] = element;

        return element;
    }

    this.removeTemplate = function(templateSelector, nextCallback, param_delay_long) {
        nextCallback = nextCallback || function() {};
        my_delay_long = param_delay_long || delay_long;

        if(!templates[templateSelector]) { return false;}

        templates[templateSelector].fadeOut(delay_short, function() {
            $(this).remove();
            delete templates[templateSelector];

            //finish the choice move
            resp.fadeOut(my_delay_long, function() {
                nextCallback();
            });
        });
    }

    this.startChoice = function(text, templateSelector, mixedOperation, trackContext) {
        if(typeof(mixedOperation) == "object") {
            var callbacks = mixedOperation;
            var beforeCallback = function(element) {
                element.on('submit', function(event) {
                    event.preventDefault();
                    $(this).addClass('was-validated');
                    me.proceed($( this ).serialize(), callbacks, trackContext);
                });
            };
        }
        else {
            var beforeCallback = mixedOperation;
        }

        this.choice(text, function() {
            me.addTemplate(templateSelector, beforeCallback);
        });
    }

    this.finishChoice = function(templateSelector, text, nextCallback) {
        this.removeTemplate(templateSelector, function() {
            me.say(text, nextCallback);
        });
    }

    this.choiceWay = function(finishTemplateSelector, finishText, text, templateSelector, mixedOperation, trackContext, repeatMe) {
        if(repeatMe) {
            finishTemplateSelector = templateSelector;
            //last response error from templateSelector

            //checkup last response. if something went wrong. We say a error instead
            if(responseData[responseData.length-1] && responseData[responseData.length-1].statusText) {
                finishText = responseData[responseData.length-1].statusText + ". Versuchen wir es erneut";
            }
            else {
                finishText = "Versuchen wir es erneut";
            }
        }

        this.finishChoice(finishTemplateSelector, finishText, function() {
            me.startChoice(text, templateSelector, mixedOperation, trackContext);
        });
    }

    this.autodelay = function(text) {
        return text.length * 50;
    }

    this.proceed = function(data, callbacks, trackContext) {
        var route = xhr_route;
        if(!route) { return false; }
        callbacks = callbacks || {success: function(me) { me.next(); }, failed: function(me) { me.repeat(); }};
        trackContext = (trackContext != null) ? trackContext : true;

        if(trackContext) {
            //checkdata
            var dataObj = {};
            switch(typeof(data)) {
                case "string":
                    dataObj = $.parseParams(data);
                    break;
                case "object":
                    dataObj = data;
                    break;
            }

            $.extend(requestData, dataObj);
        }

        client.xhr('post', route, data, function(result, data, textStatus, jqXHR) {
            responseData = $.merge(responseData, [result]);
            if(textStatus == 'success') {
                if(typeof(callbacks.success) == "function") {
                    callbacks.success(me, result, data);
                }
            }
            else {
                if(typeof(callbacks.failed) == "function") {
                    callbacks.failed(me, result, data);
                }
            }
        });
    }

    this.showContext = function() {
        console.log(requestData);
        console.log(responseData);
    }

    this.queue = function(callback) {
        if(typeof(callback) == "function") {
            return callStack.push(callback);
        }
        console.debug("Callback not callable");
    }

    this.start = function() {
        callPosition = 0;

        //remove all templates
        var keys = Object.keys(templates);
        if(keys.length) {
            me.removeTemplate(keys.pop(), function() { me.start(); });
        }
        else {
            return this.call();
        }
    }

    this.previous = function() {
        callPosition--;
        return this.call(callPosition);
    }

    this.next = function() {
        callPosition++;
        return this.call(callPosition);
    }

    this.repeat = function() {
        return this.call(null, true);
    }

    this.call = function(i, repeat) {
        i = (i != null) ? i : callPosition;
        repeat = (repeat != null) ? repeat : false;

        if(callStack.length >= i) {
            var callback = callStack[i];
            if(typeof(callback) == "function") {
                return callback(repeat);
            }
        }
        console.debug("Callback not callable");
    }


// client.ai.resume = true;
// client.ai.resumeCB = null;

// client.ai.stop = function() {
//  client.ai.resume = false;
// }

// client.ai.resume = function() {
//  var callback = client.ai.resumeCB;
//  client.ai.resumeCB = null;
//  callback();
// }

// client.ai.try_resume(callback) {
//  if(client.ai.resume) {
//      callback();
//      return true;
//  }
//  else {
//      client.ai.resumeCB = callback;
//      return false;
//  }
// }
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

function formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}

/**
 * $.parseParams - parse query string paramaters into an object.
 */
(function($) {
var re = /([^&=]+)=?([^&]*)/g;
var decodeRE = /\+/g;  // Regex for replacing addition symbol with a space
var decode = function (str) {return decodeURIComponent( str.replace(decodeRE, " ") );};
$.parseParams = function(query) {
    var params = {}, e;
    while ( e = re.exec(query) ) { 
        var k = decode( e[1] ), v = decode( e[2] );
        if (k.substring(k.length - 2) === '[]') {
            k = k.substring(0, k.length - 2);
            (params[k] || (params[k] = [])).push(v);
        }
        else params[k] = v;
    }
    return params;
};
})(jQuery);