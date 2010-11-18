
//Taken from:
//http://fitzgeraldnick.com/weblog/26/
function toArray(obj) {
    return Array.prototype.slice.call(obj);
}

// Bind in its simplest form

function bind(scope, fn) {
    return function () {
        return fn.apply(scope, toArray(arguments));
    };
}

// Taken from:
// http://www.quirksmode.org/blog/archives/2005/10/_and_the_winner_1.html
function addEvent( obj, type, fn ) {
	if (obj.addEventListener)
		obj.addEventListener( type, fn, false );
	else if (obj.attachEvent) {
		obj["e"+type+fn] = fn;
		obj[type+fn] = function() { obj["e"+type+fn]( window.event ); }
		obj.attachEvent( "on"+type, obj[type+fn] );
	}
}

function removeEvent( obj, type, fn ) {
	if (obj.removeEventListener)
		obj.removeEventListener( type, fn, false );
	else if (obj.detachEvent) {
		obj.detachEvent( "on"+type, obj[type+fn] );
		obj[type+fn] = null;
		obj["e"+type+fn] = null;
	}
}

// taken from MooTools Core
function addClass(element, className) {
	if ( element.className.indexOf(className) == -1)
		element.className = (element.className + ' ' + className).replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
};

// taken from MooTools Core
function removeClass(element, className) {
	element.className = element.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1');
};

function addStylesheet(selector, rules) {
	var stylesheet = document.createElement('style');
	stylesheet.type = 'text/css';
	stylesheet.rel = 'stylesheet';
	stylesheet.id = 'ASTEROIDSYEAHSTYLES';
	try {
		stylesheet.innerHTML = selector + "{" + rules + "}";
	} catch ( e ) {
		stylesheet.styleSheet.addRule(selector, rules);
	}
	document.getElementsByTagName("head")[0].appendChild(stylesheet);
};

function removeStylesheet(name) {
	var stylesheet = document.getElementById(name);
	if ( stylesheet ) {
		stylesheet.parentNode.removeChild(stylesheet);
	}
};
