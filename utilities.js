domInvaders.prototype.checkBrowser = function () {
	if (!this.canvas.getContext) {
		alert('Your browser sucks too much to play. Sorry.');
		return false;
	}
	
	return true;
};

domInvaders.prototype.getElementFromPoint = function (x, y) {
	this.canvas.style.visibility = 'hidden';

	var element = document.elementFromPoint(x, y);

	if (!element) {
		this.canvas.style.visibility = 'visible';
		return false;
	}

	if (element.nodeType === 3) {
		element = element.parentNode;
	}

	if (this.indexOf(this.ignoredTags, element.tagName.toUpperCase()) === -1 && this.hasOnlyTextualChildren(element)) {
		this.canvas.style.visibility = 'visible';
		return this.absolutize(element);
	}
	this.canvas.style.visibility = 'visible';

	return false;
};
	
domInvaders.prototype.hasOnlyTextualChildren = function (element) {
	var nodeCount = element.childNodes.length,
		i;
	
	if (element.offsetLeft < -100 && element.offsetWidth > 0 && element.offsetHeight > 0) {
		return false;
	}
	
	if (this.indexOf(this.hiddenTags, element.tagName) !== -1) {
		return true;
	}
	
	if (element.offsetWidth === 0 && element.offsetHeight === 0) {
		return false;
	}
			
	for (i = 0; i < nodeCount; i = i + 1) {
		// <br /> doesn't count... and empty elements
		if (this.indexOf(this.hiddenTags, element.childNodes[i].tagName) === -1
				&& element.childNodes[i].childNodes.length !== 0) {
			return false;
		}
	}
	return true;
};

domInvaders.prototype.code = function (name) {
	var table = {'up': 38, 'down': 40, 'left': 37, 'right': 39, 'esc': 27};
	if (table[name]) {
		return table[name];
	}
	return name.charCodeAt(0);
};

domInvaders.prototype.bind = function (scope, fn) {
    return function () {
        return fn.apply(scope, Array.prototype.slice.call((arguments)));
    };
};

domInvaders.prototype.addEvent = function (obj, type, fn) {
	if (obj.addEventListener) {
		obj.addEventListener(type, fn, false);
	} else if (obj.attachEvent) {
		obj["e" + type + fn] = fn;
		obj[type + fn] = function () { obj["e" + type + fn](window.event); };
		obj.attachEvent("on" + type, obj[type + fn]);
	}
};

domInvaders.prototype.removeEvent = function (obj, type, fn) {
	if (obj.removeEventListener) {
		obj.removeEventListener(type, fn, false);
	} else if (obj.detachEvent) {
		obj.detachEvent("on" + type, obj[type + fn]);
		obj[type + fn] = null;
		obj["e" + type + fn] = null;
	}
};

domInvaders.prototype.addClass = function (element, className) {
	if (element.className.indexOf(className) === -1) {
		element.className = (element.className + ' ' + className).replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
	}
};

domInvaders.prototype.removeClass = function (element, className) {
	element.className = element.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1');
};

domInvaders.prototype.indexOf = function (arr, item, from) {
	var len = arr.length,
		i = 0;
	
	if (arr.indexOf) {
		return arr.indexOf(item, from);
	}
	
	for (i = (from < 0) ? Math.max(0, len + from) : from || 0; i < len; i = i + 1) {
		if (arr[i] === item) {
			return i;
		}
	}
	return -1;
};

domInvaders.prototype.getXYpos = function (el) {
	console.log(el);
	var xy = {"x" : el.offsetLeft, "y" : el.offsetTop},
		par = this.getXYpos(el.offsetParent),
		i;
	
	if (!el) {
		return {"x": 0, "y": 0};
	}
	
	for (i = 0; i < par.length; i = i + 1) {
		xy[i] += par[i];
	}
	
	return xy;
};

domInvaders.prototype.absolutize = function (el) {
	var pos = this.getXYpos(el),
		top = pos.y,
		left = pos.x,
		width = el.clientWidth,
		height = el.clientHeight;

	el.style.position = 'absolute';
	el.style.top = top + 'px';
	el.style.left = left + 'px';
	el.style.width = width + 'px';
	el.style.height = height + 'px';
};