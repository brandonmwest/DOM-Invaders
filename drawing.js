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