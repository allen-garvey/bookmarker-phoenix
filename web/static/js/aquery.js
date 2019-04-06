/*
 * aQuery - lightweight version of jQuery 
 */

class aQueryObject{
	constructor(selector){
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
	each(func){
		for (var i = 0; i < this.length; i++) {
			func.call(this.elementList[i], i, this.elementList[i]);
		}
	}

	first(){
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
	attr(attributeName, newValue){
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
	val(newValue){
		return this.attr('value', newValue);
	}

	//convenience function for aQueryObject.attr('innerHTML', newValue)
	html(newValue){
		return this.attr('innerHTML', newValue);
	}

	//convenience function for aQueryObject.attr('innerHTML', newValue)
	text(newValue){
		return this.attr('textContent', newValue);
	}

	data(key){
		if(this.length < 1){
			return '';
		}
		return this.elementList[0].getAttribute('data-' + key);
	}

	/*
	* DOM Selection methods
	*/
	closest(selector){
		//if empty, just return same empty object
		//since empty objects have no parents
		if(this.length === 0){
			return this;
		}
		const element = this.first().elementList[0];
		let closestElement = element.closest(selector);
		//null means not found
		closestElement = closestElement || [];
		return new aQueryObject(closestElement);
	};

	/*
	* DOM Manipulation methods
	*/
	//based on http://stackoverflow.com/questions/4793604/how-to-do-insert-after-in-javascript-without-using-a-library
	//content should already be element, such as that returned by aQuery.parseHTML() or html string
	before(content){
		if(typeof content == 'string'){
			content = parseHTML(content);
		}
		this.each(function(i, element){
			element.parentNode.insertBefore(content, element);
		});
	};

	after(content){
		if(typeof content == 'string'){
			content = parseHTML(content);
		}
		this.each(function(i, element){
			element.parentNode.insertBefore(content, element.nextSibling);
		});
	};

	append(content){
		if(typeof content == 'string'){
			content = parseHTML(content);
		}
		this.each(function(i, element){
			element.appendChild(content);
		});
	};

	//http://stackoverflow.com/questions/6104125/how-can-i-remove-an-element-in-javascript-without-jquery
	remove(){
		this.each(function(i, element){
			element.parentNode.removeChild(element);
		});
	};

	/*
	* CSS Class methods
	*/
	addClass(className){
		this.each(function(i, element){
			element.classList.add(className);
		});
		return this;
	};
	removeClass(className){
		this.each(function(i, element){
			element.classList.remove(className);
		});
		return this;
	};
	toggleClass(className){
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
	hide(){
		this.each(function(i, element){
			element.style.display = 'none';
		});
		return this;
	};
	show(){
		this.each(function(i, element){
			element.style.display = 'block';
		});
		return this;
	};

	/*
	* Event methods
	*/
	on(eventName, selector, callback){
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
	click(){
		this.each(function(i, element){
			element.click();
		});
	};
}

function aQuery(selector){
	if(typeof selector === 'string' || typeof selector === 'object'){
		return (new aQueryObject(selector));
	}
}

/*
* Static methods added after aquery is initialized
*/

//based on http://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
//template tag not supported below Edge 13 so no IE
function parseHTML(html) {
	const template = document.createElement('template');
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

export default aQuery;
