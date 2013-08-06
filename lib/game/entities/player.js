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
		size: { x: 25, y: 80 },
		offset: { x: 70, y: 55 },
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.B,
		animSheet: new ig.AnimationSheet('media/img/craigen.png', 160, 138),
		maxVel: { x: 0, y: 110 },
		friction: {x: 0, y: 225 },
		speed: 200,
		ascend: 450,
		// sound: new ig.Sound('media/audio/player-engines.*'),
		soundLifetime: 1,
		attackLifetime: 0.24,
		init: function(x, y, settings) {
			this.addAnim('run', 0.03, [0,1,2,3,4,5,6,7,8,11,12,13,14,15,16,17,18,19]);
			this.addAnim('jump', 0.03, [22,23,24,25,26,27,28,29,30,31]);
			this.addAnim('fall', 0.03, [33,34,35,36,37,38,39,40,41,42,43]);
			this.addAnim('attack', 0.04, [44,45,46,47,48,49]);
			this.addAnim('death', 0.03, [55,56,57,58,59,60,61]);
			this.currentAnim = this.anims.run;
			this.parent(x, y, settings);
			this.soundTimer = new ig.Timer();
			this.attackTimer = new ig.Timer();
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
				if(this.attackTimer.delta() >= this.attackLifetime*2) {
					this.attackTimer.set(this.attackLifetime);
				}
			}
			else {
					// this.size = { x: 101, y: 117 };
					// this.currentAnim = this.anims.run;
			}
			if(this.attackTimer.delta() < 0) {
				this.currentAnim = this.anims.attack;
				ig.game.spawnEntity(EntityPlayerSword,this.pos.x,this.pos.y);
			}
			else if(this.vel.y == 0) {
				this.currentAnim = this.anims.run;
			}
			else if(this.vel.y < 0) {
				this.currentAnim = this.anims.jump;
			}
			else {
				this.currentAnim = this.anims.fall;
			}
			this.parent();
		},
		check: function(other) {
			other.check();
		},
		kill: function() {
			ig.game.spawnEntity(
				EntityPlayerDeath,
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

	EntityPlayerSword = ig.Entity.extend({
		callBack: null,
		size: { x: 100, y: 100 },
		// animSheet: new ig.AnimationSheet('media/img/red.png', 100, 100),
		type: ig.Entity.TYPE.A,
		checkAgainst: ig.Entity.TYPE.B,
		init: function(x, y, settings) {
			// this.addAnim('idle', 0.1, [0]);
			this.parent(x, y, settings);
			this.idleTimer = new ig.Timer();
			// if(ig.Sound.enabled)
			// 	this.sound.play();
		},
		update: function() {
			if(this.idleTimer.delta() > ig.game.player.attackLifetime) {
				this.kill();
				if(this.callBack) {
					this.callBack();
				}
				return;
			}
			this.parent();
		},
		draw: function() {
			// this.pos.x -= ig.game.speed;
			this.parent();
		},
		check: function(other) {
			other.kill();
		}
	});

	EntityPlayerDeath = ig.Entity.extend({
		lifetime: 1,
		callBack: null,
		size: { x: 1, y: 1 },
		maxVel: { x: 0, y: 0 },
		offset: { x: -50, y: -40 },
		animSheet: new ig.AnimationSheet('media/img/craigen.png', 160, 138),
		type: ig.Entity.TYPE.NONE,
		// sound: new ig.Sound('media/audio/player-explosion.*'),
		init: function(x, y, settings) {
			this.addAnim('death', 0.05, [55,56,57,58,59,60,61]);
			this.parent(x, y, settings);
			this.idleTimer = new ig.Timer();
			if(ig.Sound.enabled)
				this.sound.play();
		},
		update: function() {
			if(this.idleTimer.delta() > this.lifetime) {
				this.kill();
				if(this.callBack) {
					this.callBack();
				}
				return;
			}
			this.parent();
		},
		draw: function() {
			this.pos.x -= ig.game.speed;
			this.parent();
		}
	});
});