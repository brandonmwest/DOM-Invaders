var domInvaders = function() {
    this.init();
};

domInvaders.prototype.init = function() {
	this.setupUtilities();
	this.setupDrawing();
	this.setupCanvas();
	this.getConfiguration();
	this.drawing.game = this;
	this.setupResize();
	this.setPlayerStepSize();
	this.setBulletStepSize();
	this.setupKeys();
}

domInvaders.prototype.setupUtilities = function() {
	this.utilities = new domInvaders.utilities();
}

domInvaders.prototype.setupUtilities = function() {
	this.drawing = new domInvaders.drawing(this);
}

domInvaders.prototype.getConfiguration = function() {
	//possibly refactor to extend from another object that is passed in so these are only applied as defaults
	this.playerWidth = 50;
	this.playerHeight = 15;
	this.bulletWidth = 3;
	this.bulletHeight = 12;
	
	this.fps = 50;
	
	//scalars for the canvas size... number of units on each axis
	this.unitsX = 80;
	this.unitsY = 80;
	
	this.playerSpeed = .5;
	this.bulletSpeed = 1.5;
	
	this.playerX = (this.w-this.playerWidth)/2;
	this.playerY = this.h-this.playerHeight-10;
	
	this.ignoredTags = ['HTML', 'HEAD', 'BODY', 'SCRIPT', 'TITLE', 'META', 'STYLE', 'LINK'];
	this.hiddenTags = ['BR', 'HR'];
}

domInvaders.prototype.setupCanvas = function(){
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
	if (!this.checkBrowser()){
		return;
	}
	this.ctx = this.canvas.getContext("2d");
	this.ctx.fillStyle = "black";
	this.ctx.strokeStyle = "black";
	this.drawing.ctx = this.ctx;
}

domInvaders.prototype.setupResize = function() {
	//depends on utilities.js
	addEvent(window, 'resize', bind(this,this.resize));
}

domInvaders.prototype.resize = function() {		
	this.w = document.documentElement.clientWidth;
	this.h = document.documentElement.clientHeight;
	
	this.canvas.setAttribute('width', this.w);
	this.canvas.setAttribute('height', this.h);
	
	this.setPlayerStepSize();
	this.setBulletStepSize();
	//todo: reposition the player and enemies ?
}

domInvaders.prototype.setPlayerStepSize = function() {
	this.playerStepSize = this.w / this.unitsX * this.playerSpeed;
}
	
domInvaders.prototype.setBulletStepSize = function() {
	this.bulletStepSize = this.h / this.unitsY * this.bulletSpeed;
}

domInvaders.prototype.setupKeys: function() {
	this.keysPressed = {};
	addEvent(document, 'keydown', bind(this,this.keydown));
	addEvent(document, 'keypress', bind(this,this.keypress));
	addEvent(document, 'keyup', bind(this,this.keyup));
},

domInvaders.prototype.events = {
	keydown: function(event) {
		event = event || window.event;
		this.keysPressed[event.keyCode] = true;
		
		switch ( event.keyCode ) {
			case code(' '):
				this.fireBullet();
			break;
		}
		
		this.stopEventPropagation(event);
		return false;
	},
	
	keypress: function(event) {
		event = event || window.event;
		this.stopEventPropagation(event);
		return false;
	},
	
	keyup: function(event) {
		event = event || window.event;
		this.keysPressed[event.keyCode] = false;

		this.stopEventPropagation(event);
		return false;
	},
	
	stopEventPropagation: function(event){
		if ( indexOf([code('up'), code('down'), code('right'), code('left'), code(' '), code('B'), code('W'), code('A'), code('S'), code('D')], event.keyCode) != -1 ) {
			if ( event.preventDefault )
				event.preventDefault();
			if ( event.stopPropagation)
				event.stopPropagation();
			event.returnValue = false;
			event.cancelBubble = true;
			return false;
		}
	}
}

var domInvaders = {
	initialize: function() {
		this.setupCanvas();
		this.getConfiguration();
		this.drawing.game = this;
		this.setupResize();
		this.setPlayerStepSize();
		this.setBulletStepSize();
		this.setupKeys();
		
		//todo: import utilties.js 
		this.intervalId = setInterval(bind(this,this.draw),1000/this.fps);
	},

	
	drawPlayer: function() {
		//base
		this.drawing.rect(this.playerX, this.playerY, this.playerWidth, this.playerHeight);
		//tier1
		this.drawing.rect(this.playerX + this.playerWidth*.075, this.playerY - this.playerHeight*.25, this.playerWidth*.85, this.playerHeight*.25);
		//tier2
		this.drawing.rect(this.playerX + this.playerWidth*.40, this.playerY -  this.playerHeight*.80, this.playerWidth*.20, this.playerHeight*.80);
		//top nub
		this.drawing.rect(this.playerX + this.playerWidth/2-this.bulletWidth/2, this.playerY - this.playerHeight, this.bulletWidth, this.playerHeight*1.25);
	},
	
	fireBullet: function() {
		if(this.firing)
			return;
			
		this.firing = true;
		this.drawBullet();
	},
	
	drawBullet: function() {
		this.bulletX = this.playerX + this.playerWidth/2-this.bulletWidth/2;
		this.bulletY = this.playerY - this.playerHeight*1.25;
		
		this.drawing.rect(this.bulletX, this.bulletY, this.bulletWidth, this.bulletHeight);
	},
	

		
	draw: function() {
		this.drawing.clear();
		this.setPlayerXY();
		this.drawPlayer();
		
		this.updateEnemies();
		
		if(this.firing)
			this.updateBullet();
	},
	
	setPlayerXY: function() {
		if(this.keysPressed[code('left')]) {
			var newX = this.playerX - this.playerStepSize;
			this.playerX = newX <= 0 ? 0 : newX;
		}
		if(this.keysPressed[code('right')]) {
			var newX = this.playerX + this.playerStepSize;
			this.playerX = newX >= this.w - this.playerWidth ? this.w  - this.playerWidth : newX;
		}
	},
	
	updateBullet: function() {
		//move bullet
		this.bulletY = this.bulletY - this.bulletStepSize;
		this.drawing.rect(this.bulletX, this.bulletY, this.bulletWidth, this.bulletHeight);

		//check for collision or bound
		if(this.bulletY <= 0)
			this.firing = false;

		var collidedElement = this.getElementFromPoint(this.bulletX, this.bulletY);
	
		if(collidedElement){
			collidedElement.parentNode.removeChild(collidedElement);
			addClass(collidedElement,'dead');
			
			var nodeCount = collidedElement.parentNode.childNodes.length;
			for ( var i = 0; i < nodeCount; i++ ) {
				absolutize(collidedElement.parentNode.childNodes[i]);
			}

			this.firing = false;

			return;
		}
	},
	
	getElementFromPoint: function(x, y) {
		this.canvas.style.visibility='hidden';

		var element = document.elementFromPoint(x, y);

		if (!element) {
			this.canvas.style.visibility='visible';
			return false;
		}

		if ( element.nodeType == 3 )
			element = element.parentNode;

		if (indexOf(this.ignoredTags, element.tagName.toUpperCase()) == -1
			&& this.hasOnlyTextualChildren(element)){
				this.canvas.style.visibility='visible';
				return absolutize(element);
			}
		this.canvas.style.visibility='visible';

		return false;
	},
	
	hasOnlyTextualChildren: function(element) {
		if ( element.offsetLeft < -100 && element.offsetWidth > 0 && element.offsetHeight > 0 ) return false;
		if ( indexOf(this.hiddenTags, element.tagName) != -1 ) return true;
		
		if ( element.offsetWidth == 0 && element.offsetHeight == 0 ) return false;
		
		var nodeCount = element.childNodes.length;
		for ( var i = 0; i < nodeCount; i++ ) {
			// <br /> doesn't count... and empty elements
			if (
				indexOf(this.hiddenTags, element.childNodes[i].tagName) == -1
				&& element.childNodes[i].childNodes.length != 0
			) return false;
		}
		return true;
	},
	
	updateEnemies: function() {
	
	},
	
	
		
};