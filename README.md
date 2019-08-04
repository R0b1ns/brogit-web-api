# brogit W-API
*v1.19.7* - [api.brogit.de](https://api.brogit.de/)


## Features
* Simple XHR
	* Auto loading spinner
	* Scroll Reloading XHR via limit & offset
* Client text response builder
* Generic design helper features

## Documentation

Soon you can check the Documentation on [brogit.de/documentation](https://brogit.de/documentation).
  
The *js* brings the **client** object and some smart functions

### Bug notice
If you use < base href="#" >. You have to set before loading this script. Instead this will have a wrong origin in some cases.

### client.xhr
`client.xhr(mode, route, data, callback);`  

* __mode__ _String_ Requestmethod like GET, POST, PUT ...

* __route__ _String_ Relative URL from _client.origin_

* __data__ _PlainObject or String or Array_ Data which is send in the request

* __callback__ _function_ Callback with the args _resultdata, data, textStatus, jqXHR_ which is executed on success and error

	#### Example
	~~~javascript
	client.xhr(
		'get',
		'api/user',
		{id: 1, foo:"bar"},
		function(resultdata, data, textStatus, jqXHR) {
			if(success(resultdata) {
				console.log("Function Success returns true, when resultdata.status == 200");
			}
			else {
				console.log("resultdata.status != 200");
			}
			//textStatus tells me if general successful request
		}
	);
	~~~

### client.loxhr

For this feature your Server have to accept _limit_ and _offset_

`client.loxhr(mode, route, data, callback, containerElement);`

* __data__ _PlainObject or String or Array_ Data which is send in the request. Auto add _limit (default=10) and offset_

* __containerElement__ The container element where u append content with the callback

	#### Example
	~~~javascript
	client.loxhr(
		'get',
		'api/user',
		{},
		function(resultdata, data, textStatus, jqXHR) {
			if(success(resultdata) {
				for(var i = 0; i < resultdata.data.length; i++) {
					$('#containerElement').append(resultdata.data[i].name);
				}
			}
		},
		$('#containerElement')
	);
	~~~
	
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
Copyright 2017-2019 Robin Biegel and brogit.de  
Code released under the [Non-Profit Open Software License ("Non-Profit OSL") 3.0](https://opensource.org/licenses/NPOSL-3.0)