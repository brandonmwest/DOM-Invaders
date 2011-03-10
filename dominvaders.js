/*global window */

var domInvaders = function () {
    this.init();
};

domInvaders.prototype.init = function () {
	this.setupDrawing();
	this.setupCanvas();
	this.getConfiguration();
	this.drawing.game = this;
	this.setupResize();
	this.setPlayerStepSize();
	this.setBulletStepSize();
	this.setupKeys();
	
	//todo: import utilties.js and drawing.js
	//fire up the loop
	this.intervalId = setInterval(this.bind(this, this.draw), 1000 / this.fps);
};

domInvaders.prototype.setupUtilities = function () {
	this.drawing = new domInvaders.drawing(this);
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
	this.drawing.ctx = this.ctx;
};

domInvaders.prototype.setupResize = function () {
	//depends on utilities.js
	this.addEvent(window, 'resize', this.bind(this, this.resize));
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
	this.addEvent(document, 'keydown', this.bind(this, this.events.keydown));
	this.addEvent(document, 'keypress', this.bind(this, this.events.keypress));
	this.addEvent(document, 'keyup', this.bind(this, this.events.keyup));
};

domInvaders.prototype.events = {
	keydown: function (event) {
		event = event || window.event;
		this.keysPressed[event.keyCode] = true;
		
		switch (event.keyCode) {
		case this.code(' '):
			this.fireBullet();
			break;
			
		default:
			break;
		}
		
		this.stopEventPropagation(event);
		return false;
	},
	
	keypress: function (event) {
		event = event || window.event;
		this.stopEventPropagation(event);
		return false;
	},
	
	keyup: function (event) {
		event = event || window.event;
		this.keysPressed[event.keyCode] = false;

		this.stopEventPropagation(event);
		return false;
	},
	
	stopEventPropagation: function (event) {
		var code = this.code;
		if (this.indexOf([code('up'), code('down'), code('right'), code('left'), code(' '), code('B'), code('W'), code('A'), code('S'), code('D')], event.keyCode) !== -1) {
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
	}
};
	
domInvaders.prototype.setPlayerXY = function () {
	var newX,
	    code = this.code;
	if (this.keysPressed[code('left')]) {
		newX = this.playerX - this.playerStepSize;
		this.playerX = newX <= 0 ? 0 : newX;
	}
	if (this.keysPressed[code('right')]) {
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
	//move bullet
	this.bulletY = this.bulletY - this.bulletStepSize;
	this.drawing.rect(this.bulletX, this.bulletY, this.bulletWidth, this.bulletHeight);

	//check for collision or bound
	if (this.bulletY <= 0) {
		this.firing = false;
	}

	var collidedElement = this.getElementFromPoint(this.bulletX, this.bulletY),
		i, 
		nodeCount;

	if (collidedElement) {
		collidedElement.parentNode.removeChild(collidedElement);
		this.addClass(collidedElement, 'dead');
		
		nodeCount = collidedElement.parentNode.childNodes.length;
		for (i = 0; i < nodeCount; i = i + 1) {
			this.absolutize(collidedElement.parentNode.childNodes[i]);
		}

		this.firing = false;

		return;
	}
};

domInvaders.prototype.updateEnemies = function () {

};