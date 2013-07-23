ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity',
	'impact.sound'
)
.defines(function(){
	// The Player Entity
	EntityPlayer = ig.Entity.extend({
		health: 100,
		maxHealth: 100,
		size: { x: 160, y: 138 },
		offset: { x: 0, y: 0 },
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.B,
		animSheet: new ig.AnimationSheet('media/img/craigen.png', 160, 138),
		maxVel: { x: 0, y: 110 },
		friction: {x: 0, y: 225 },
		speed: 200,
		ascend: 350,
		sound: new ig.Sound('media/audio/player-engines.*'),
		soundLifetime: 1,
		init: function(x, y, settings) {
			this.addAnim('run', 0.03, [0,1,2,3,4,5,6,7,8,11,12,13,14,15,16,17,18,19]);
			this.addAnim('jump', 0.03, [22,23,24,25,26,27,28,29,30,31]);
			this.addAnim('fall', 0.03, [33,34,35,36,37,38,39,40,41,42,43]);
			this.addAnim('attack', 0.03, [44,45,46,47,48,49]);
			this.addAnim('death', 0.03, [55,56,57,58,59,60,61]);
			this.currentAnim = this.anims.run;
			this.parent(x, y, settings);
			this.soundTimer = new ig.Timer();
		},
		update: function() {
			if(ig.input.pressed('up') || ig.input.state('click')) {
				if(ig.game.player.pos.y > ig.game.screen.y) {
					if(ig.Sound.enabled && this.soundTimer.delta() >= 0) {
						this.sound.play();
						this.soundTimer.set(this.soundLifetime);
					}
					this.vel.y = -this.ascend;
					// this.size = { x: 89, y: 81 };
					// this.currentAnim = this.anims.jump;
				}
			}
			else if(ig.input.pressed('attack')) {
				if(ig.Sound.enabled && this.soundTimer.delta() >= 0) {
					this.sound.play();
					this.soundTimer.set(this.soundLifetime);
				}
				// this.size = { x: 89, y: 81 };
				// set lifetime of the animation
				this.currentAnim = this.anims.attack;
			}
			else {
					// this.size = { x: 101, y: 117 };
					// this.currentAnim = this.anims.run;
			}
			if(this.vel.y < 0) {
				this.currentAnim = this.anims.jump;
			}
			else {
				this.currentAnim = this.anims.run;
			}
			this.parent();
		},
		check: function(other) {
			other.check();
		},
		kill: function() {
			ig.game.spawnEntity(
				EntityPlayerExplosion,
				ig.game.player.pos.x-70,
				ig.game.player.pos.y-90,
				{ callBack: this.onDeath }
			);
			this.parent();
		},
		onDeath: function() {
			ig.game.gameOver = true;
		}
	});

	// EntityPlayerExplosion = ig.Entity.extend({
	// 	lifetime: 1.5,
	// 	callBack: null,
	// 	size: { x: 1, y: 1 },
	// 	maxVel: { x: 0, y: 0 },
	// 	animSheet: new ig.AnimationSheet('media/img/player-explosion.png', 174, 208),
	// 	type: ig.Entity.TYPE.NONE,
	// 	sound: new ig.Sound('media/audio/player-explosion.*'),
	// 	init: function(x, y, settings) {
	// 		this.addAnim('kaboom', 0.03, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
	// 			21,22,23,24,25,26,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
	// 		this.parent(x, y, settings);
	// 		this.idleTimer = new ig.Timer();
	// 		if(ig.Sound.enabled)
	// 			this.sound.play();
	// 	},
	// 	update: function() {
	// 		if(this.idleTimer.delta() > this.lifetime) {
	// 			this.kill();
	// 			if(this.callBack) {
	// 				this.callBack();
	// 			}
	// 			return;
	// 		}
	// 		this.parent();
	// 	},
	// 	draw: function() {
	// 		this.pos.x = ig.game.screen.x;
	// 		this.parent();
	// 	}
	// });
});