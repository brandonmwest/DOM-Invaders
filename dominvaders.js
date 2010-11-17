var domInvaders = {
	initialize: function() {
		this.getConfiguration();
		this.setupCanvas();
		this.checkBrowser();
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
		w = document.documentElement.clientWidth;
		h = document.documentElement.clientHeight;
		
		this.container = document.createElement('div');
		this.container.className = 'domInvadersContainer';
		document.body.appendChild(this.container);

		this.canvas = document.createElement('canvas');
		this.canvas.setAttribute('width', w);
		this.canvas.setAttribute('height', h);
		this.canvas.className = 'domInvadersCanvas';
		with ( this.canvas.style ) {
			width = w + "px";
			height = h + "px";
			position = "fixed";
			top = "0px";
			left = "0px";
			bottom = "0px";
			right = "0px";
			zIndex = "10000";
		}
		
		this.container.appendChild(this.canvas);
		this.ctx = this.canvas.getContext("2d");
		this.ctx.fillStyle = "black";
		this.ctx.strokeStyle = "black";
	},
	
	checkBrowser: function() {
		if ( ! this.canvas.getContext ) {
			alert('Your browser sucks too much to play. Sorry.');
		}
	}
};