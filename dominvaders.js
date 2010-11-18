var domInvaders = {
	initialize: function() {
		this.setupCanvas();
		this.getConfiguration();
		this.drawing.game = this;
		this.setupResize();
		this.setupKeys();
		
		//todo: import utilties.js 
		this.intervalId = setInterval(bind(this,this.draw), 10);
	},
	
	getConfiguration: function() {
		this.playerWidth = 50;
		this.playerHeight = 20;
		
		//pixel based values so the speed changes based on canvas size. implement scaled values
		this.playerSpeed = 5;
		this.bulletSpeed = 10;
		
		//these are dependent on the interval time 
		//todo: switch to FPS calculated values
		this.particleSpeed = 400;
 		this.timeBetweenEnemyFire = 150;
		this.bulletRadius = 4;
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
	
	fireBullet: function() {
		if(this.firing)
			return;
			
		this.firing = true;
		this.drawBullet();
	},
	
	drawBullet: function() {
		this.bulletX = this.playerX + this.playerWidth/2;
		this.bulletY = this.playerY;
		
		this.drawing.circle(this.bulletX, this.bulletY, this.bulletRadius);
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
		
		if(this.firing)
			this.updateBullet();
	},
	
	setPlayerXY: function() {
		if(this.keysPressed[code('left')]) {
			var newX = this.playerX - this.playerSpeed;
			this.playerX = newX <= 0 ? 0 : newX;
		}
		if(this.keysPressed[code('right')]) {
			var newX = this.playerX + this.playerSpeed;
			this.playerX = newX >= this.w - this.playerWidth ? this.w  - this.playerWidth : newX;
		}
	},
	
	updateBullet: function() {
		//move bullet
		this.bulletY = this.bulletY - this.bulletSpeed;
		this.drawing.circle(this.bulletX, this.bulletY, this.bulletRadius);

		//check for collision or bound
		if(this.bulletY <= 0)
			this.firing = false;
	},
	
	drawing: {
		game: '',
		rect: function(x,y,w,h) {
			this.game.ctx.beginPath();
			this.game.ctx.rect(x,y,w,h);
			this.game.ctx.closePath();
			this.game.ctx.fill();
		},
		circle: function(x,y,r) {
			this.game.ctx.beginPath();
			this.game.ctx.arc(x, y, r, 0, Math.PI*2, true);
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
				this.fireBullet();
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