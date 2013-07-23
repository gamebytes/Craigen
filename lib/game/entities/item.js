ig.module(
	'game.entities.item'
)
.requires(
	'impact.entity'
)
.defines(function(){
	// The Collectable Coin Entity
	EntityItemCoin = ig.Entity.extend({
		size: { x: 30, y: 29 },
		maxVel: { x: 0, y: 0 },
		animSheet: new ig.AnimationSheet('media/img/goldcoin.png', 30, 29),
		type: ig.Entity.TYPE.B,
		// sound: new ig.Sound('media/audio/bonus-collect.*'),
		init: function(x, y, settings) {
			this.addAnim('idle', 0.1, [0]);		
			this.parent(x, y, settings);
			this.pos.x += 5;
			this.pos.y += 10;
		},
		update: function() {
			this.parent();
			if(this.pos.x-ig.game.screen.x < -this.size.x) {
				this.kill();
			}
		},
		check: function(other) {
			ig.game.score += 200;
			ig.game.coins++;
			if(ig.Sound.enabled)
				this.sound.play();
			this.kill();
		}
	});

	// The Collectable Spikes Entity
	EntityItemSpikes = ig.Entity.extend({
		size: { x: 40, y: 25 },
		maxVel: { x: 0, y: 0 },
		animSheet: new ig.AnimationSheet('media/img/spikes.png', 40, 25),
		type: ig.Entity.TYPE.B,
		// sound: new ig.Sound('media/audio/bonus-collect.*'),
		init: function(x, y, settings) {
			this.addAnim('idle', 0.1, [0]);		
			this.parent(x, y, settings);
			this.pos.x -= 5;
			this.pos.y += 15;
		},
		update: function() {
			this.parent();
			if(this.pos.x-ig.game.screen.x < -this.size.x) {
				this.kill();
			}
		},
		check: function(other) {
			// ig.game.score += 200;
			// ig.game.coins++;
			if(ig.Sound.enabled)
				this.sound.play();
			this.kill();
			ig.game.player.kill();
		}
	});

	// // Asteroids Entity
	// EntityAsteroid = ig.Entity.extend({
	// 	sizes: [16,21,32,42,47],
	// 	damage: [10,10,20,30,30],
	// 	num: 0,
	// 	speed: 0,
	// 	maxVel: { x: 0, y: 0 },
	// 	type: ig.Entity.TYPE.B,
	// 	sound: new ig.Sound('media/audio/asteroid-hit.*'),
	// 	init: function( x, y, settings ) {
	// 		this.num = Math.floor(Math.random()*this.sizes.length);
	// 		var actualSize = this.sizes[this.num];
	// 		this.size = { x: actualSize, y: actualSize };
	// 		this.animSheet = new ig.AnimationSheet('media/img/asteroid-'+actualSize+'.png', actualSize, actualSize);
	// 		var animationTable = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
	// 		if(Math.random() < 0.5) {
	// 			animationTable.reverse();
	// 		}
	// 		this.addAnim('rotate', 0.07, animationTable);
	// 		this.parent( x, y, settings );
	// 		this.speed = ig.game.speed + Math.random()*ig.game.speed - Math.random()*ig.game.speed;
	// 	},
	// 	update: function() {
	// 		this.parent();
	// 		if(this.pos.x-ig.game.screen.x < -50) {
	// 			this.kill();
	// 		}
	// 	},
	// 	check: function(other) {
	// 		ig.game.player.receiveDamage(this.damage[this.num],this);
	// 		ig.game.UIShield.currentAnim = ig.game.UIShield.anims[ig.game.player.health.floor().toString()];
	// 		if(ig.game.player.health <= 0) {
	// 			ig.game.gameOverType = 'asteroid';
	// 		}
	// 		if(ig.Sound.enabled)
	// 			this.sound.play();
	// 		this.kill();
	// 	},
	// 	kill: function() {
	// 		if(this.pos.x+50 > 0) {
	// 			if(ig.game.BtnBomb && ig.game.BtnBomb.bombingInProgress) {
	// 				ig.game.spawnEntity(EntityAsteroidExplosion, this.pos.x-42, this.pos.y-42);
	// 			}
	// 			else {
	// 				ig.game.spawnEntity(EntityAsteroidExplosion, ig.game.player.pos.x, ig.game.player.pos.y-40);
	// 			}
	// 		}
	// 		this.parent();
	// 	}
	// });
	// EntityAsteroidExplosion = ig.Entity.extend({
	// 	lifetime: 0.3,
	// 	size: { x: 1, y: 1 },
	// 	maxVel: { x: 0, y: 0 },
	// 	animSheet: new ig.AnimationSheet('media/img/asteroid-explosion.png', 93, 96),
	// 	type: ig.Entity.TYPE.NONE,
	// 	init: function(x, y, settings) {
	// 		this.addAnim('hit', 0.03, [9,8,7,6,5,4,3,2,1,0]);
	// 		this.addAnim('bomb', 0.03, [23,22,21,20,19,18,17,16,15,14,13,12,11,10]);
	// 		this.parent(x, y, settings);
	// 		this.idleTimer = new ig.Timer();
	// 		this.currentAnim = (ig.game.BtnBomb && ig.game.BtnBomb.bombingInProgress) ? this.anims['bomb'] : this.anims['hit'];
	// 	},
	// 	update: function() {
	// 		if(this.idleTimer.delta() > this.lifetime) {
	// 			this.kill();
	// 			return;
	// 		}
	// 		this.parent();
	// 	}
	// });	
	// // The Collectable Shield Entity
	// EntityItemShield = ig.Entity.extend({
	// 	size: { x: 28, y: 23 },
	// 	maxVel: { x: 0, y: 0 },
	// 	animSheet: new ig.AnimationSheet('media/img/shield.png', 28, 23),
	// 	type: ig.Entity.TYPE.B,
	// 	sound: new ig.Sound('media/audio/shield-collect.*'),
	// 	init: function(x, y, settings) {
	// 		this.addAnim('idle', 0.1, [0]);
	// 		this.parent(x, y, settings);
	// 	},
	// 	update: function() {
	// 		this.parent();
	// 		if(this.pos.x-ig.game.screen.x < -this.size.x) {
	// 			this.kill();
	// 		}
	// 	},
	// 	check: function(other) {
	// 		ig.game.player.health += 20;
	// 		if(ig.game.player.health > ig.game.player.maxHealth) {
	// 			ig.game.player.health = ig.game.player.maxHealth;
	// 		}
	// 		ig.game.UIShield.currentAnim = ig.game.UIShield.anims[ig.game.player.health.floor().toString()];
	// 		if(ig.Sound.enabled)
	// 			this.sound.play();
	// 		this.kill();
	// 	}
	// });

	// // The Collectable Bomb Entity
	// EntityItemBomb = ig.Entity.extend({
	// 	size: { x: 28, y: 23 },
	// 	maxVel: { x: 0, y: 0 },
	// 	animSheet: new ig.AnimationSheet('media/img/bomb.png', 28, 23),
	// 	type: ig.Entity.TYPE.B,
	// 	sound: new ig.Sound('media/audio/shield-collect.*'),
	// 	init: function(x, y, settings) {
	// 		this.addAnim('idle', 0.1, [0]);
	// 		this.parent(x, y, settings);
	// 	},
	// 	update: function() {
	// 		this.parent();
	// 		if(this.pos.x-ig.game.screen.x < -this.size.x) {
	// 			this.kill();
	// 		}
	// 	},
	// 	check: function(other) {
	// 		ig.game.BtnBomb.currentAnim = ig.game.BtnBomb.anims['active'];
	// 		if(ig.Sound.enabled)
	// 			this.sound.play();
	// 		this.kill();
	// 	}
	// });

	// // The Collectable Star Entity
	// EntityItemStar = ig.Entity.extend({
	// 	size: { x: 26, y: 26 },
	// 	maxVel: { x: 0, y: 0 },
	// 	animSheet: new ig.AnimationSheet('media/img/star.png', 26, 26),
	// 	type: ig.Entity.TYPE.B,
	// 	sound: new ig.Sound('media/audio/bonus-collect.*'),
	// 	init: function(x, y, settings) {
	// 		this.addAnim('rotate', 0.1, [0,1,2,3,4,5,6,7,8]);		
	// 		this.parent(x, y, settings);
	// 	},
	// 	update: function() {
	// 		this.parent();
	// 		if(this.pos.x-ig.game.screen.x < -this.size.x) {
	// 			this.kill();
	// 		}
	// 	},
	// 	check: function(other) {
	// 		ig.game.score += 200;
	// 		if(ig.Sound.enabled)
	// 			this.sound.play();
	// 		this.kill();
	// 	}
	// });

	// // The Mine Entity
	// EntityItemMine = ig.Entity.extend({
	// 	size: { x: 32, y: 32 },
	// 	maxVel: { x: 0, y: 0 },
	// 	direction: 0,
	// 	animSheet: new ig.AnimationSheet('media/img/mine.png', 32, 32),
	// 	type: ig.Entity.TYPE.B,
	// 	init: function(x, y, settings) {
	// 		this.addAnim('idle', 0.1, [0]);
	// 		this.parent(x, y, settings);
	// 		this.direction = ((Math.floor((Math.random()*2))*2)-1); // 1 or -1
	// 	},
	// 	update: function() {
	// 		this.parent();
	// 		if(this.pos.x - ig.game.screen.x < -this.size.x) {
	// 			this.kill();
	// 		}
	// 		if(this.pos.y > ig.system.height-this.size.y || this.pos.y < 0) { // out of the screen
	// 			this.direction = -this.direction;
	// 		}
	// 		this.pos.y += this.direction;
	// 	},
	// 	check: function(other) {
	// 		this.kill();
	// 		ig.game.gameOverType = 'mine';
	// 		ig.game.player.kill();
	// 	}
	// });
});