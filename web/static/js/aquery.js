/**
* Polyfills loaded before other modules
*/

//Polyfill for Element.matches (required for delegated events and .closest() IE and Edge polyfill)
//source: https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.matchesSelector || 
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector || 
        Element.prototype.oMatchesSelector || 
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;            
        };
}
/*
 * aQuery - lightweight version of jQuery 
 */

 //core functionality required to work
 //modules should go between core_start and core_end
'use strict';

function aQuery(selector){
	function aQueryObject(selector){
		if(typeof selector === 'string'){
			this.elementList = document.querySelectorAll(selector);
		}
		else if(selector instanceof Element){
			this.elementList = [selector];
		}
		else{
			//assume elementList
			this.elementList = selector;
		}
		this.length = this.elementList.length >= 0 ? this.elementList.length : 1;
	}
	/*
	* General utility methods
	*/
	//callback - index, element
	aQueryObject.prototype.each = function(func){
		for (var i = 0; i < this.length; i++) {
			func.call(this.elementList[i], i, this.elementList[i]);
		}
	}

	aQueryObject.prototype.first = function(){
		//if empty, just return same empty object
		//since all empty objects are functionally identical
		if(this.length === 0){
			return this;
		}
		return new aQueryObject(this.elementList[0]);
	}
/*
* Text, inner html and data methods
*/

//if new value is set, sets first element attribute to that value
//otherwise returns the value of that attribute for the first element
//in the collection
aQueryObject.prototype.attr = function(attributeName, newValue){
	var setVal = typeof newValue === 'string' ? true : false;

	var ret = setVal ? this : '';

	if(this.length > 0){
		if(setVal && typeof this.elementList[0][attributeName] !== undefined){
			this.elementList[0][attributeName] = newValue;
		}
		else{
			ret = this.elementList[0][attributeName];
		}
	}
	return ret;
}


//convenience function for aQueryObject.attr('value', newValue)
aQueryObject.prototype.val = function(newValue){
	return this.attr('value', newValue);
}

//convenience function for aQueryObject.attr('innerHTML', newValue)
aQueryObject.prototype.html = function(newValue){
	return this.attr('innerHTML', newValue);
}

//convenience function for aQueryObject.attr('innerHTML', newValue)
aQueryObject.prototype.text = function(newValue){
	return this.attr('textContent', newValue);
}

aQueryObject.prototype.data = function(key){
	if(this.length < 1){
		return '';
	}
	return this.elementList[0].getAttribute('data-' + key);
}



/*
* DOM Selection methods
*/

aQueryObject.prototype.closest = function(selector){
	//if empty, just return same empty object
	//since empty objects have no parents
	if(this.length === 0){
		return this;
	}
	var element = this.first().elementList[0];
	//check for closest support: edge has no support
	//https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
	if(element.closest){
		var closestElement = element.closest(selector);
		//null means not found
		closestElement = closestElement ? closestElement : [];
		return new aQueryObject(closestElement);
	}
	//for Edge and IE
	var parent = element.parentElement;
	//parentElement returns null if element doesn't have parent (i.e HTML tag)
	while(parent){
		if(parent.matches(selector)){
			return new aQueryObject(parent);
		}
		parent = element.parentElement;
	}
	//not found
	return new aQueryObject([]);
};
/*
* DOM Manipulation methods
*/

//based on http://stackoverflow.com/questions/4793604/how-to-do-insert-after-in-javascript-without-using-a-library
//content should already be element, such as that returned by aQuery.parseHTML() or html string
aQueryObject.prototype.before = function(content){
	if(typeof content == 'string'){
		content = aQuery.parseHTML(content);
	}
	this.each(function(i, element){
		element.parentNode.insertBefore(content, element);
	});
};

aQueryObject.prototype.after = function(content){
	if(typeof content == 'string'){
		content = aQuery.parseHTML(content);
	}
	this.each(function(i, element){
		element.parentNode.insertBefore(content, element.nextSibling);
	});
};

aQueryObject.prototype.append = function(content){
	if(typeof content == 'string'){
		content = aQuery.parseHTML(content);
	}
	this.each(function(i, element){
		element.appendChild(content);
	});
};

//http://stackoverflow.com/questions/6104125/how-can-i-remove-an-element-in-javascript-without-jquery
aQueryObject.prototype.remove = function(){
	if(typeof content == 'string'){
		content = aQuery.parseHTML(content);
	}
	this.each(function(i, element){
		element.parentNode.removeChild(element);
	});
};

/*
* CSS Class methods
*/
aQueryObject.prototype.addClass = function(className){
	this.each(function(i, element){
		element.classList.add(className);
	});
	return this;
};
aQueryObject.prototype.removeClass = function(className){
	this.each(function(i, element){
		element.classList.remove(className);
	});
	return this;
};
aQueryObject.prototype.toggleClass = function(className){
	this.each(function(i, element){
		element.classList.toggle(className);
	});
	return this;
};
/*
* Basic transitions
* note that show and hide will overwrite any inline display properties
* and that show will change display to block
*/

aQueryObject.prototype.hide = function(){
	this.each(function(i, element){
		element.style.display = 'none';
	});
	return this;
};
aQueryObject.prototype.show = function(){
	this.each(function(i, element){
		element.style.display = 'block';
	});
	return this;
};
/*
* Event methods
*/

aQueryObject.prototype.on = function(eventName, selector, callback){
	//check if using delegation
	if(selector instanceof Function){
		//not using delegation
		var callbackFunc = function(e){ selector.call(e.target, e); };
	}
	else{
		//using delegation
		//based on: https://davidwalsh.name/event-delegate
		var callbackFunc = function(e){
			if(e.target && e.target.matches(selector)){
				callback.call(e.target, e);
			}
		};
	}
	//add event listers
	this.each(function(i, element){
		//element.addEventListener(eventName, function(e){callbackFunc.call(element, e);}, false);
		element.addEventListener(eventName, callbackFunc, false);
	});

};
//calls onclick callback(s)
aQueryObject.prototype.click = function(){
	this.each(function(i, element){
		element.click();
	});
};
	/*
	* Input validation
	*/
	if(typeof selector === 'string' || typeof selector === 'object'){
		return (new aQueryObject(selector));
	}
}
/*
* Static methods added after aquery is initialized
*/

//based on http://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
//template tag not supported below Edge 13 so no IE
aQuery.parseHTML = function(html) {
	var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstElementChild;
};
/*
* Minimal template functions
* similar to underscore templates but using handlebar syntax
* only {{variable}} for HTML escaped value and {{{variable}}} for unescaped 
* is supported and unset variables are not replaced with anything
* Usage: aQuery.template('my template string {{variableName}}') returns templater object
* templater.render({variableName: 'variable value'}) returns string of compiled template
* with set variables replaced by HTML escaped values
*/

aQuery.template = function(templateString){
	function Templater(templateString){
		this.templateString = templateString;
	}
	//based on:
	//http://stackoverflow.com/questions/1787322/htmlspecialchars-equivalent-in-javascript
	Templater.prototype.escapeHTML = function(text){
		if(typeof text === 'number'){
			return text;
		}
		var map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;'
		};
		return text.replace(/[&<>"']/g, function(m) { return map[m]; });
	};
	//takes context object with keys as variable names
	//and values as variable values
	//returns string
	//keeps markup for non passed variables
	Templater.prototype.render = function(context){
		var rendered = this.templateString;
		for (var key in context){
			//replace unescaped values
			var searchExpUnsafe = new RegExp('{{{\\s*' + key + '\\s*}}}', 'g');
			rendered = rendered.replace(searchExpUnsafe, context[key]);
			//replace escaped values
			var searchExpSafe = new RegExp('{{\\s*' + key + '\\s*}}', 'g');
			rendered = rendered.replace(searchExpSafe, this.escapeHTML(context[key]));
		}
		return rendered;
	};

	return new Templater(templateString);
};



/*
* AJAX methods
*/

/*
* Main ajax method
* Required settings: url
* optional settings: success, error, method, data, dataType
*/
aQuery.ajax = function(settings){
	if(!settings.url){
		throw new Error('url not supplied for aQuery ajax method');
	}
	var defaultSettings = {method: 'GET', success: function(){}, error: function(){}, data: null, dataType: 'text'};
	//fill empty settings with defaults
	for(var key in defaultSettings){
		if(!settings[key]){
			settings[key] = defaultSettings[key];
		}
	}


	//send the request
	var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState != XMLHttpRequest.DONE){
        	return;
        }
        var data = xmlhttp.response;
        if(settings.dataType === 'json' || xmlhttp.getResponseHeader("Content-Type") === 'application/json'){
        	data = JSON.parse(data);
        }
       	if(xmlhttp.status <= 200 && xmlhttp.status < 300){
        	settings.success(data);
       	}
       	else{
        	settings.error(data);
       	}
    };
    //creates url query string from data
    function getQueryString(data){
    	if(!data || Object.keys(data).length === 0){
    		return '';
    	}
    	var dataArray = Object.keys(data).map(function(key){ return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]); });
    	return '?' + dataArray.join('&');
    }
    //encodes data into FormData object
    function encodeRequestBody(data){
		if(!data || Object.keys(data).length === 0){
    		return null;
    	}
    	var formData = new FormData();
    	for(var key in data){
    		formData.append(key, data[key]);
    	}
    	return formData;
    }
    //For GET requests, encode data into query string
    if(settings.method.match(/^get$/i)){
    	var url = settings.url + getQueryString(settings.data);
    	var data = null;
    }
    else{
    	var url = settings.url;
    	var data = encodeRequestBody(settings.data);
    }

    xmlhttp.open(settings.method, url, true);
    xmlhttp.send(data);
};
