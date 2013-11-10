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
			// spawn entity monster dead
			this.parent();
		}
	});

	EntityMonsterDead = ig.Entity.extend({
		init: function(x, y, settings) {
			this.addAnim('idle', 1, [0]);
			this.parent(x, y, settings);
		},
		update: function() {
			this.parent();
			if(this.pos.x-ig.game.screen.x < -this.size.x) {
				this.kill();
			}
		}
	});

	EntityMonsterGoblin = EntityMonster.extend({
		size: { x: 108, y: 68 },
		animSheet: new ig.AnimationSheet('media/img/monster-goblin.png', 108, 68),
		group: 'long',
		init: function(x, y, settings) {
			this.addAnim('idle', 0.1, [0,1,2,3,4,5,6,7,8,9]);
			this.parent(x, y, settings);
			this.pos.x -= 0;
			this.pos.y -= 25;
		},
		kill: function() {
			if(ig.Sound.enabled)
				this.sound.play();
			ig.game.spawnEntity(EntityMonsterDeath, this.pos.x, this.pos.y);
			ig.game.spawnEntity(EntityMonsterDeadGoblin, this.pos.x, this.pos.y);
			this.parent();
		}
	});
	EntityMonsterDeadGoblin = EntityMonsterDead.extend({
		size: { x: 82, y: 82 },
		animSheet: new ig.AnimationSheet('media/img/monster-goblin-dead.png', 82, 82),
	});

	EntityMonsterSkeleton = EntityMonster.extend({
		size: { x: 84, y: 86 },
		animSheet: new ig.AnimationSheet('media/img/monster-skeleton.png', 84, 86),
		group: 'short',
		init: function(x, y, settings) {
			this.addAnim('idle', 0.1, [0,1,2,3,4,5,6,7,8]);
			this.parent(x, y, settings);
			this.pos.x -= 0;
			this.pos.y -= 45;
		},
		kill: function() {
			if(ig.Sound.enabled)
				this.sound.play();
			ig.game.spawnEntity(EntityMonsterDeath, this.pos.x, this.pos.y);
			ig.game.spawnEntity(EntityMonsterDeadSkeleton, this.pos.x, this.pos.y);
			this.parent();
		}
	});
	EntityMonsterDeadSkeleton = EntityMonsterDead.extend({
		size: { x: 75, y: 85 },
		animSheet: new ig.AnimationSheet('media/img/monster-skeleton-dead.png', 75, 85),
	});

	EntityMonsterOrk = EntityMonster.extend({
		size: { x: 89, y: 85 },
		animSheet: new ig.AnimationSheet('media/img/monster-ork.png', 89, 85),
		group: 'short',
		init: function(x, y, settings) {
			this.addAnim('idle', 0.1, [0,1,2,3,4,5,6,7,8,9,10,11]);
			this.parent(x, y, settings);
			this.pos.x -= 0;
			this.pos.y -= 42;
		},
		kill: function() {
			if(ig.Sound.enabled)
				this.sound.play();
			ig.game.spawnEntity(EntityMonsterDeath, this.pos.x, this.pos.y);
			ig.game.spawnEntity(EntityMonsterDeadOrk, this.pos.x, this.pos.y);
			this.parent();
		}
	});
	EntityMonsterDeadOrk = EntityMonsterDead.extend({
		size: { x: 124, y: 112 },
		animSheet: new ig.AnimationSheet('media/img/monster-ork-dead.png', 124, 112),
	});

	EntityMonsterVulture = EntityMonster.extend({
		size: { x: 83, y: 74 },
		animSheet: new ig.AnimationSheet('media/img/monster-vulture.png', 83, 74),
		group: 'fly',
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
		},
		kill: function() {
			if(ig.Sound.enabled)
				this.sound.play();
			ig.game.spawnEntity(EntityMonsterDeath, this.pos.x, this.pos.y);
			ig.game.spawnEntity(EntityMonsterDeadVulture, this.pos.x, this.pos.y);
			this.parent();
		}
	});
	EntityMonsterDeadVulture = EntityMonsterDead.extend({
		size: { x: 82, y: 51 },
		animSheet: new ig.AnimationSheet('media/img/monster-vulture-dead.png', 82, 51),
		update: function() {
			this.pos.y += 1;
			this.parent();
			if(this.pos.x-ig.game.screen.x < -this.size.x || this.pos.y < -this.size.y) {
				this.kill();
			}
		}
	});

	EntityMonsterBat = EntityMonster.extend({
		size: { x: 95, y: 69 },
		animSheet: new ig.AnimationSheet('media/img/monster-bat.png', 95, 69),
		group: 'fly',
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
		},
		kill: function() {
			if(ig.Sound.enabled)
				this.sound.play();
			ig.game.spawnEntity(EntityMonsterDeath, this.pos.x, this.pos.y);
			ig.game.spawnEntity(EntityMonsterDeadBat, this.pos.x, this.pos.y);
			this.parent();
		}
	});
	EntityMonsterDeadBat = EntityMonsterDead.extend({
		size: { x: 31, y: 63 },
		animSheet: new ig.AnimationSheet('media/img/monster-bat-dead.png', 31, 63),
		update: function() {
			this.pos.y += 1;
			this.parent();
			if(this.pos.x-ig.game.screen.x < -this.size.x || this.pos.y < -this.size.y) {
				this.kill();
			}
		}
	});

	EntityMonsterWolf = EntityMonster.extend({
		size: { x: 141, y: 85 },
		animSheet: new ig.AnimationSheet('media/img/monster-wolf.png', 141, 85),
		group: 'long',
		init: function(x, y, settings) {
			this.addAnim('idle', 0.1, [0,1,2,3,4,5,6,7,8,9,10]);
			this.parent(x, y, settings);
			this.pos.x -= 0;
			this.pos.y -= 45;
		},
		kill: function() {
			if(ig.Sound.enabled)
				this.sound.play();
			ig.game.spawnEntity(EntityMonsterDeath, this.pos.x, this.pos.y);
			ig.game.spawnEntity(EntityMonsterDeadWolf, this.pos.x, this.pos.y);
			this.parent();
		}
	});
	EntityMonsterDeadWolf = EntityMonsterDead.extend({
		size: { x: 107, y: 59 },
		animSheet: new ig.AnimationSheet('media/img/monster-wolf-dead.png', 107, 59),
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