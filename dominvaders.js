/*global window */

var domInvaders = function () {
    this.init();
};

domInvaders.prototype.init = function () {
	this.setupCanvas();
	this.getConfiguration();
	this.setupResize();
	this.setPlayerStepSize();
	this.setBulletStepSize();
	this.setupKeys();
	
	this.intervalId = setInterval(this.bind(this, this.draw), 1000 / this.fps);
};

domInvaders.prototype.getConfiguration = function () {
	//possibly refactor to extend from another object that is passed in so these are only applied as defaults
	this.playerWidth = 50;
	this.playerHeight = 15;
	this.bulletWidth = 3;
	this.bulletHeight = 12;
	
	this.fps = 50;
	
	//scalars for the canvas size... number of units on each axis
	this.unitsX = 80;
	this.unitsY = 80;
	
	this.playerSpeed = 0.5;
	this.bulletSpeed = 1.5;
	
	this.playerX = (this.w - this.playerWidth) / 2;
	this.playerY = this.h - this.playerHeight - 10;
	
	this.ignoredTags = ['HTML', 'HEAD', 'BODY', 'SCRIPT', 'TITLE', 'META', 'STYLE', 'LINK'];
	this.hiddenTags = ['BR', 'HR'];
};

domInvaders.prototype.setupCanvas = function () {
	this.w = document.documentElement.clientWidth;
	this.h = document.documentElement.clientHeight;
	
	this.container = document.createElement('div');
	this.container.className = 'domInvadersContainer';
	document.body.appendChild(this.container);

	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('width', this.w);
	this.canvas.setAttribute('height', this.h);
	this.canvas.className = 'domInvadersCanvas';
	this.canvas.style.width = this.w + "px";
	this.canvas.style.height = this.h + "px";
	this.canvas.style.position = "fixed";
	this.canvas.style.top = "0px";
	this.canvas.style.left = "0px";
	this.canvas.style.bottom = "0px";
	this.canvas.style.right = "0px";
	this.canvas.style.zIndex = "10000";
		
	this.container.appendChild(this.canvas);
	if (!this.checkBrowser()) {
		return;
	}
	this.ctx = this.canvas.getContext("2d");
	this.ctx.fillStyle = "black";
	this.ctx.strokeStyle = "black";
};

domInvaders.prototype.setupResize = function () {
	//depends on utilities.js
	this.addEvent(window, 'resize', this.resize);
};

domInvaders.prototype.resize = function () {		
	this.w = document.documentElement.clientWidth;
	this.h = document.documentElement.clientHeight;
	
	this.canvas.setAttribute('width', this.w);
	this.canvas.setAttribute('height', this.h);
	
	this.setPlayerStepSize();
	this.setBulletStepSize();
	//todo: reposition the player and enemies ?
};

domInvaders.prototype.setPlayerStepSize = function () {
	this.playerStepSize = this.w / this.unitsX * this.playerSpeed;
};
	
domInvaders.prototype.setBulletStepSize = function () {
	this.bulletStepSize = this.h / this.unitsY * this.bulletSpeed;
};

domInvaders.prototype.setupKeys = function () {
	this.keysPressed = {};
	this.addEvent(document, 'keydown', this.bind(this, this.keydown));
	this.addEvent(document, 'keypress',  this.bind(this, this.keypress));
	this.addEvent(document, 'keyup',  this.bind(this, this.keyup));
};

domInvaders.prototype.keydown = function (event) {
	event = event || window.event;
	this.keysPressed[event.keyCode] = true;
	
	switch (event.keyCode) {
	case this.getKeyCode(' '):
		this.fireBullet();
		break;
		
	default:
		break;
	}
	
	this.stopEventPropagation(event);
	return false;
};
	
domInvaders.prototype.keypress = function (event) {
	event = event || window.event;
	this.stopEventPropagation(event);
	return false;
};
	
domInvaders.prototype.keyup = function (event) {
	event = event || window.event;
	this.keysPressed[event.keyCode] = false;

	this.stopEventPropagation(event);
	return false;
};
	
domInvaders.prototype.stopEventPropagation = function (event) {
	var getKeyCode = this.getKeyCode;
	if (this.indexOf([getKeyCode('up'), getKeyCode('down'), getKeyCode('right'), getKeyCode('left'), getKeyCode(' '), getKeyCode('B'), getKeyCode('W'), getKeyCode('A'), getKeyCode('S'), getKeyCode('D')], event.keyCode) !== -1) {
		if (event.preventDefault) {
			event.preventDefault();
		}
		if (event.stopPropagation) {
			event.stopPropagation();
		}
		event.returnValue = false;
		event.cancelBubble = true;
		return false;
	}
};
	
domInvaders.prototype.setPlayerXY = function () {
	var newX,
	    getKeyCode = this.getKeyCode;
	if (this.keysPressed[getKeyCode('left')]) {
		newX = this.playerX - this.playerStepSize;
		this.playerX = newX <= 0 ? 0 : newX;
	}
	if (this.keysPressed[getKeyCode('right')]) {
		newX = this.playerX + this.playerStepSize;
		this.playerX = newX >= this.w - this.playerWidth ? this.w  - this.playerWidth : newX;
	}
};

domInvaders.prototype.fireBullet = function () {
	if (this.firing) {
		return;
	}
		
	this.firing = true;
	this.drawBullet();
};

domInvaders.prototype.updateBullet = function () {
	this.bulletY = this.bulletY - this.bulletStepSize;
	this.rect(this.bulletX, this.bulletY, this.bulletWidth, this.bulletHeight);

	if (this.bulletY <= 0) {
		this.firing = false;
	}

	var collidedElement = this.getElementFromPoint(this.bulletX, this.bulletY);
	
	if (collidedElement) {
		collidedElement.parentNode.removeChild(collidedElement);
		this.addClass(collidedElement, 'dead');
		
		this.firing = false;

		return;
	}
};

domInvaders.prototype.updateEnemies = function () {
	
};

domInvaders.prototype.draw = function () {
	this.clear();
	this.setPlayerXY();
	this.drawPlayer();
	this.drawEnemies();
	this.updateEnemies();
	
	if (this.firing) {
		this.updateBullet();
	}
};

domInvaders.prototype.drawPlayer = function () {
	//base
	this.rect(this.playerX, this.playerY, this.playerWidth, this.playerHeight);
	//tier1
	this.rect(this.playerX + this.playerWidth * 0.075, this.playerY - this.playerHeight * 0.25, this.playerWidth * 0.85, this.playerHeight * 0.25);
	//tier2
	this.rect(this.playerX + this.playerWidth * 0.40, this.playerY -  this.playerHeight * 0.80, this.playerWidth * 0.20, this.playerHeight * 0.80);
	//top nub
	this.rect(this.playerX + this.playerWidth / 2 - this.bulletWidth / 2, this.playerY - this.playerHeight, this.bulletWidth, this.playerHeight * 1.25);
};

domInvaders.prototype.drawEnemies = function () {
	
};

domInvaders.prototype.drawBullet = function () {
	this.bulletX = this.playerX + this.playerWidth / 2 - this.bulletWidth / 2;
	this.bulletY = this.playerY - this.playerHeight * 1.25;
	
	this.rect(this.bulletX, this.bulletY, this.bulletWidth, this.bulletHeight);
};

domInvaders.prototype.rect = function (x, y, w, h) {
	this.ctx.beginPath();
	this.ctx.rect(x, y, w, h);
	this.ctx.closePath();
	this.ctx.fill();
};

domInvaders.prototype.circle = function (x, y, r) {
	this.ctx.beginPath();
	this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
	this.ctx.closePath();
	this.ctx.fill();
};
		
domInvaders.prototype.clear = function () {
	this.ctx.clearRect(0, 0, this.w, this.h);
};

domInvaders.prototype.checkBrowser = function () {
	if (!this.canvas.getContext) {
		window.alert("Your browser can't draw a canvas. Sorry.");
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
		return element;
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

domInvaders.prototype.getKeyCode = function (keyName) {
	var codes = {'up': 38, 'down': 40, 'left': 37, 'right': 39, 'esc': 27};
	if (codes[keyName]) {
		return codes[keyName];
	}
	return keyName.charCodeAt(0);
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

domInvaders.prototype.getElementCoordinates = function (el) {
	var xy = {"x" : el.offsetLeft, "y" : el.offsetTop},
		par = this.getElementCoordinates(el.offsetParent),
		i;
	
	if (!el) {
		return {"x": 0, "y": 0};
	}
	
	for (i = 0; i < par.length; i = i + 1) {
		xy[i] += par[i];
	}
	
	return xy;
};