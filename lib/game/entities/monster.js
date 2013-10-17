ig.module(
	'game.entities.monster'
)
.requires(
	'impact.entity'
)
.defines(function(){
	// The Monster Entity
	EntityMonster = ig.Entity.extend({
		// size: { x: 30, y: 29 },
		maxVel: { x: 0, y: 0 },
		friction: {x: 0, y: 225 },
		// animSheet: new ig.AnimationSheet('media/img/goldcoin.png', 30, 29),
		type: ig.Entity.TYPE.B,
		sound: new ig.Sound('media/audio/swordkill.*'),
		init: function(x, y, settings) {
			// this.addAnim('idle', 0.1, [0]);		
			this.parent(x, y, settings);
		},
		update: function() {
			this.parent();
			if(this.pos.x-ig.game.screen.x < -this.size.x) {
				this.kill();
			}
		},
		check: function(other) {
			// fire onDeath animation
			this.kill();
			ig.game.player.kill();
		},
		kill: function() {
			if(ig.Sound.enabled)
				this.sound.play();
			// this.currentAnim = 'death';
			ig.game.spawnEntity(EntityMonsterDeath, this.pos.x, this.pos.y);
			this.parent();
		}
	});

	EntityMonsterGoblin = EntityMonster.extend({
		size: { x: 108, y: 68 },
		animSheet: new ig.AnimationSheet('media/img/monster-goblin.png', 108, 68),
		init: function(x, y, settings) {
			this.addAnim('idle', 0.1, [0,1,2,3,4,5,6,7,8,9]);
			this.parent(x, y, settings);
			this.pos.x -= 0;
			this.pos.y -= 25;
		}
	});

	EntityMonsterSkeleton = EntityMonster.extend({
		size: { x: 84, y: 86 },
		animSheet: new ig.AnimationSheet('media/img/monster-skeleton.png', 84, 86),
		init: function(x, y, settings) {
			this.addAnim('idle', 0.1, [0,1,2,3,4,5,6,7,8]);
			this.parent(x, y, settings);
			this.pos.x -= 0;
			this.pos.y -= 45;
		}
	});

	EntityMonsterOrk = EntityMonster.extend({
		size: { x: 89, y: 85 },
		animSheet: new ig.AnimationSheet('media/img/monster-ork.png', 89, 85),
		init: function(x, y, settings) {
			this.addAnim('idle', 0.1, [0,1,2,3,4,5,6,7,8,9,10,11]);
			this.parent(x, y, settings);
			this.pos.x -= 0;
			this.pos.y -= 42;
		}
	});

	EntityMonsterVulture = EntityMonster.extend({
		size: { x: 83, y: 74 },
		animSheet: new ig.AnimationSheet('media/img/monster-vulture.png', 83, 74),
		friction: {x: 0, y: 0 },
		init: function(x, y, settings) {
			this.addAnim('idle', 0.1, [0,1,2,3,4,5,6,7,8,9]);
			this.parent(x, y, settings);
			this.pos.x -= 0;
			this.pos.y -= 0;
		},
		update: function() {
			this.pos.x -= 1;
			this.parent();
			if(this.pos.x-ig.game.screen.x < -this.size.x) {
				this.kill();
			}
		}
	});

	EntityMonsterBat = EntityMonster.extend({
		size: { x: 95, y: 69 },
		animSheet: new ig.AnimationSheet('media/img/monster-bat.png', 95, 69),
		friction: {x: 0, y: 0 },
		init: function(x, y, settings) {
			this.addAnim('idle', 0.1, [0,1,2,3,4,5,6,7,8,9,10]);
			this.parent(x, y, settings);
			this.pos.x -= 0;
			this.pos.y -= 0;
		},
		update: function() {
			this.pos.x -= 1;
			this.parent();
			if(this.pos.x-ig.game.screen.x < -this.size.x) {
				this.kill();
			}
		}
	});

	EntityMonsterWolf = EntityMonster.extend({
		size: { x: 141, y: 85 },
		animSheet: new ig.AnimationSheet('media/img/monster-wolf.png', 141, 85),
		init: function(x, y, settings) {
			this.addAnim('idle', 0.1, [0,1,2,3,4,5,6,7,8,9,10]);
			this.parent(x, y, settings);
			this.pos.x -= 0;
			this.pos.y -= 40;
		}
	});

	EntityMonsterDeath = ig.Entity.extend({
		lifetime: 0.3,
		size: { x: 1, y: 1 },
		maxVel: { x: 0, y: 0 },
		animSheet: new ig.AnimationSheet('media/img/monster-death.png', 78, 66),
		friction: {x: 0, y: 0 },
		type: ig.Entity.TYPE.NONE,
		init: function(x, y, settings) {
			this.addAnim('death', 0.03, [0,1,2,3,4,5,6,7,8]);
			this.parent(x, y, settings);
			this.idleTimer = new ig.Timer();
		},
		update: function() {
			if(this.idleTimer.delta() > this.lifetime) {
				this.kill();
				return;
			}
			this.parent();
		}
	});
});