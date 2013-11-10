ig.module(
	'game.entities.item'
)
.requires(
	'impact.entity'
)
.defines(function(){
	// The Collectable Coin Entity
	// EntityItemCoin = ig.Entity.extend({
	// 	size: { x: 30, y: 29 },
	// 	maxVel: { x: 0, y: 0 },
	// 	animSheet: new ig.AnimationSheet('media/img/goldcoin.png', 30, 29),
	// 	type: ig.Entity.TYPE.B,
	// 	// sound: new ig.Sound('media/audio/bonus-collect.*'),
	// 	init: function(x, y, settings) {
	// 		this.addAnim('idle', 0.1, [0]);		
	// 		this.parent(x, y, settings);
	// 		this.pos.x += 5;
	// 		this.pos.y += 10;
	// 	},
	// 	update: function() {
	// 		this.parent();
	// 		if(this.pos.x-ig.game.screen.x < -this.size.x) {
	// 			this.kill();
	// 		}
	// 	},
	// 	check: function(other) {
	// 		ig.game.score += 200;
	// 		ig.game.coins++;
	// 		if(ig.Sound.enabled)
	// 			this.sound.play();
	// 		this.kill();
	// 	}
	// });

	// The Collectable Spikes Entity
	EntityItemSpikes = ig.Entity.extend({
		size: { x: 40, y: 25 },
		maxVel: { x: 0, y: 0 },
		animSheet: new ig.AnimationSheet('media/img/spikes.png', 40, 25),
		friction: {x: 0, y: 225 },
		type: ig.Entity.TYPE.B,
		// sound: new ig.Sound('media/audio/bonus-collect.*'),
		init: function(x, y, settings) {
			this.addAnim('idle', 0.1, [0]);		
			this.parent(x, y, settings);
			this.pos.x -= 0; // 5
			this.pos.y += 0; // 17
		},
		update: function() {
			this.parent();
			if(this.pos.x-ig.game.screen.x < -this.size.x) {
				this.kill();
			}
		},
		check: function(other) {
			// if(ig.Sound.enabled)
			// 	this.sound.play();
			this.kill();
			ig.game.player.kill();
		}
	});
});