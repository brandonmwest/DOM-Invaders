var domInvaders = {
	initialize: function() {
		this.getConfiguration();
		this.setupCanvas();
		this.drawing.game = this;
		this.setupResize();
		this.setupPlayer();
		//todo: import utilties.js 

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
		this.maxBullets = 10;
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
	
	setupPlayer: function() {
		//draw the ship
		this.drawing.rect(this.w/2, this.h-this.playerHeight, this.playerWidth, this.playerHeight);
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
			this.game.ctx.clearRect(0, 0, game.w, game.h);
		}
	}
};