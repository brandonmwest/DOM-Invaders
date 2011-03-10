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