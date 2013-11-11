ig.module(
	'game.entities.item'
)
.requires(
	'impact.entity'
)
.defines(function(){
	// The Spikes Entity
	EntityItemSpikes = ig.Entity.extend({
		size: { x: 40, y: 25 },
		offset: { x: 0, y: -1 },
		maxVel: { x: 0, y: 0 },
		animSheet: new ig.AnimationSheet('media/img/spikes.png', 40, 25),
		friction: {x: 0, y: 225 },
		type: ig.Entity.TYPE.B,
		init: function(x, y, settings) {
			this.addAnim('idle', 1, [0]);		
			this.parent(x, y, settings);
			this.pos.x -= 0;
			this.pos.y += 0;
		},
		update: function() {
			this.parent();
			if(this.pos.x-ig.game.screen.x < -this.size.x) {
				this.kill();
			}
		},
		check: function(other) {
			this.kill();
			ig.game.player.kill();
		}
	});
});