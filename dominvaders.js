domInvaders.prototype = {
	initialize: function() {
		this.getConfiguration();
		this.setupCanvas();
		this.checkBrowser();
	},
	
	getConfiguration: function() {
		this.playerWidth = 50;
		this.playerHeight = 20;
		
		this.w = document.documentElement.clientWidth;
		this.h = document.documentElement.clientHeight;
	},
	
	setupCanvas: function(){
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
