# brogit W-API

## Features
* Simple XHR
	* Auto loading spinner
	* Scroll Reloading XHR via limit & offset
* Client text response builder
* Generic design helper features

## Requirements
* _brogit.js_
	* [jQuery](https://github.com/jquery/jquery) > 3.0.0
* _brogit.feature.js_
	* [jQuery](https://github.com/jquery/jquery) > 3.0.0
	* [bootstrap](https://github.com/twbs/bootstrap) > 4.0.0
	* (optional) [Moment.js](https://github.com/moment/moment/) > 2.0.0
	* (optional) [toastr](https://github.com/CodeSeven/toastr) > 2.0.0
	
## Getting Started
~~~html
<!-- jQuery, bootstrap -->
	<script src="https://code.jquery.com/jquery-3.4.0.min.js" crossorigin="anonymous"></script>

	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

<!-- moment.js -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment-with-locales.min.js"></script>

<!-- brogit-web-api -->
	<script src="https://api.brogit.de/brogit.min.js" type="text/javascript"></script>
	<link href="https://api.brogit.de/brogit.min.css" rel="stylesheet">
	<script src="https://api.brogit.de/brogit.feature.min.js" type="text/javascript"></script>
	<link href="https://api.brogit.de/brogit.feature.min.css" rel="stylesheet">
~~~


## Documentation

Soon you can check the Documentation on [brogit.de/docs#webapi](https://brogit.de/docs#webapi).
  
The *js* brings the **client** object and some smart functions

### Bug notice
If you use < base href="#" >. You have to set before loading this script. Instead this will have a wrong origin in some cases.

### client.xhr
`client.xhr(mode, route, data, callback);`  

* __mode__ _String_ Requestmethod like GET, POST, PUT ...

* __route__ _String_ Relative URL from _client.origin_

* __data__ _PlainObject or String or Array_ Data which is send in the request

* __callback__ _function_ Callback with the args _resultdata, data, textStatus, jqXHR_ which is executed on success and error

	* __resultdata__ _Object_ If the request was successful it contains the response data. If not it contains the errorThrown Object
	* __data__ _PlainObject or String or Array_ Contains __data__ from the request
	* __textStatus__ _String_ Can be "success", "notmodified", "nocontent", "error", "timeout", "abort", or "parsererror" -- Look in jQuery Documentation
	* __jqXHR__ _jqXHR_ XMLHTTPRequest object

#### Example
~~~javascript
client.xhr(
	'get',
	'api/user',
	{id: 1, foo:"bar"},
	function(resultdata, data, textStatus, jqXHR) {
		if(textStatus == 'success') {
			console.log("Function Success returns true, when resultdata.status == 200");
		}
		else {
			console.log(resultdata);
		}
	}
);
~~~

### client.loxhr

For this feature your Server have to accept _limit_ and _offset_

`client.loxhr(mode, route, data, callback, containerElement);`

* __data__ _PlainObject or String or Array_ Data which is send in the request. Auto add _limit (default=10) and offset_

* __containerElement__ The container element where u append content with the callback

_All other arguments are equal client.xhr_

#### Example
~~~javascript
client.loxhr(
	'get',
	'api/user',
	{},
	function(resultdata, data, textStatus, jqXHR) {
		if(textStatus == 'success') {
			if(resultdata.data) {
				for(var i = 0; i < resultdata.data.length; i++) {
					$('#containerElement').append(resultdata.data[i].name);
				}
			}
		}
	},
	$('#containerElement')
);
~~~

### client.* Variables

* __client.origin__ _String_ URL for requests
* __client.status__ _String_ Indicator if requests are still in progress ("load", "ready")

### client.loadCallback

Function which is executed when a request via _client.xhr_ or _client.loxhr_ is started.
Default: Add loading spinner on bottom left of the main element

### client.readyCallback

Function which is executed when all requests are done
Default: Fade out and remove all elements with the class .load

### client.ai

Coming soon. Check example and source code

#### Example

~~~javascript
client.ai.init('api/test');
	
client.ai.queue(function(repeat) {
	var starter = function() {
		client.ai.startChoice("Can u fill the Form out and click the button for me?", 'template.one');
	}

	if(!repeat) {
		client.ai.say("Hello World", starter);
	}
	else {
        client.ai.finishChoice('template.one', "We try this again", starter);
	}
});
	
client.ai.queue(function(repeat) {
	client.ai.choiceWay(
		'template.one', "Thank you",
		"Now follow the instructions in the Form", 'template.two',
		null, //callbackobjectlist or function(element) { client.ai.proceed(...) }
		null,
		repeat
	);
});
//when u type null for the callbackobjectlist, it mades generic {success: function(me) { me.next(); }, failed: function(me) { me.repeat(); }}
	
client.ai.start();
~~~


## Credits
Thanks to Tobias Ahlin for his cool loading spinner.
Also a thank to jQuery, bootstrap and momentjs

## Copyright
Copyright 2017-2020 Robin Biegel and brogit.de  
Code released under the [Non-Profit Open Software License ("Non-Profit OSL") 3.0](https://opensource.org/licenses/NPOSL-3.0)
