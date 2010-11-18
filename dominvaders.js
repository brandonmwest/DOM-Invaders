var domInvaders = {
	initialize: function() {
		this.setupCanvas();
		this.getConfiguration();
		this.drawing.game = this;
		this.setupResize();
		this.setupKeys();
		
		//this.draw();
		//todo: import utilties.js 
		this.intervalId = setInterval(bind(this,this.draw), 10);
	},
	
	getConfiguration: function() {
		this.playerWidth = 50;
		this.playerHeight = 20;
		// units/second
		
		this.acc = 300;
		this.maxSpeed = 600;
		
		this.bulletSpeed = 700;
		this.particleSpeed = 400;
		this.timeBetweenFire = 150; // how many milliseconds between shots
		this.timeBetweenEnemyFire = 150;
		this.bulletRadius = 2;
		this.maxParticles = 40;
	
		this.playerX = (this.w-this.playerWidth)/2;
		this.playerY = this.h-this.playerHeight-10;
	},
	
	setupCanvas: function(){
		this.w = document.documentElement.clientWidth;
		this.h = document.documentElement.clientHeight;
		
		this.container = document.createElement('div');
		this.container.className = 'domInvadersContainer';
		document.body.appendChild(this.container);

		this.canvas = document.createElement('canvas');
		this.canvas.setAttribute('width', this.w);
		this.canvas.setAttribute('height', this.h);
		this.canvas.className = 'domInvadersCanvas';
		with ( this.canvas.style ) {
			width = this.w + "px";
			height = this.h + "px";
			position = "fixed";
			top = "0px";
			left = "0px";
			bottom = "0px";
			right = "0px";
			zIndex = "10000";
		}
		
		this.container.appendChild(this.canvas);
		if (!this.checkBrowser()){
			return;
		}
		this.ctx = this.canvas.getContext("2d");
		this.ctx.fillStyle = "black";
		this.ctx.strokeStyle = "black";
		this.drawing.ctx = this.ctx;
	},
	
	setupResize: function() {
		//depends on utilities.js
		addEvent(window, 'resize', bind(this,this.eventResize));
	},
	
	eventResize: function() {		
		this.w = document.documentElement.clientWidth;
		this.h = document.documentElement.clientHeight;
		
		this.canvas.setAttribute('width', this.w);
		this.canvas.setAttribute('height', this.h);
		
		//todo: reposition the player and enemies ?
	},
		
	checkBrowser: function() {
		if ( ! this.canvas.getContext ) {
			alert('Your browser sucks too much to play. Sorry.');
			return false;
		}
		return true;
	},
	
	drawPlayer: function() {
		this.drawing.rect(this.playerX, this.playerY, this.playerWidth, this.playerHeight);
	},
	
	setupKeys: function() {
		this.keysPressed = {};
		addEvent(document, 'keydown', bind(this,this.eventKeydown));
		addEvent(document, 'keypress', bind(this,this.eventKeypress));
		addEvent(document, 'keyup', bind(this,this.eventKeyup));
	},
	
	draw: function() {
		this.drawing.clear();
		this.setPlayerXY();
		this.drawPlayer();		
	},
	
	setPlayerXY: function() {
		if(this.keysPressed[code('left')]) {
			var newX = this.playerX - 5;
			this.playerX = newX <= 0 ? 0 : newX;
		}
		if(this.keysPressed[code('right')]) {
			var newX = this.playerX + 5;
			this.playerX = newX >= this.w - this.playerWidth ? this.w  - this.playerWidth : newX;
		}
	},
	
	drawing: {
		game: '',
		rect: function(x,y,w,h) {
			this.game.ctx.beginPath();
			this.game.ctx.rect(x,y,w,h);
			this.game.ctx.closePath();
			this.game.ctx.fill();
		},
		clear: function() {
			this.game.ctx.clearRect(0, 0, this.game.w, this.game.h);
		}
	},
	
	eventKeydown: function(event) {
		event = event || window.event;
		this.keysPressed[event.keyCode] = true;
		
		switch ( event.keyCode ) {
			case code(' '):
				that.firedAt = 1;
			break;
		}
		
		this.stopEventPropagation(event);
		return false;
	},
	
	eventKeypress: function(event) {
		event = event || window.event;
		this.stopEventPropagation(event);
		return false;
	},
	
	eventKeyup: function(event) {
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
};