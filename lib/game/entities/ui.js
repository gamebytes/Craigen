ig.module(
	'game.entities.ui'
)
.requires(
	'impact.entity'
)
.defines(function(){
	// The UI Score Entity
	EntityUIScore = ig.Entity.extend({
		font: new ig.Font('media/telemarines.font.png'),
		size: { x: 103, y: 34 },
		maxVel: { x: 0, y: 0 },
		animSheet: new ig.AnimationSheet('media/img/ui-score.png', 103, 34),
		type: ig.Entity.TYPE.NONE,
		init: function(x, y, settings) {
			this.addAnim('idle', 0.1, [0]);
			this.parent(x, y, settings);
		},
		update: function() {
			this.parent();
		},
		draw: function() {
			this.parent();
			// this.font.draw(ig.game.score.floor().toString(), this.pos.x+140-ig.game.screen.x, this.pos.y+5, ig.Font.ALIGN.RIGHT);
		}
	});
	// The UI Highscore Entity
	EntityUIHighscore = EntityUIScore.extend({
		size: { x: 134, y: 44 },
		animSheet: new ig.AnimationSheet('media/img/ui-highscore.png', 134, 44),
		init: function(x, y, settings) {
			this.addAnim('idle', 0.1, [0]);
			this.parent(x, y, settings);
			ig.game.highscore = 1000;
		},
		draw: function() {
			this.parent();
			this.font.draw(ig.game.highscore.floor().toString()+" m", this.pos.x+70-ig.game.screen.x, this.pos.y+22, ig.Font.ALIGN.CENTER);
		}
	});
	// The UI Cash Entity
	EntityUICash = ig.Entity.extend({
		font: new ig.Font('media/telemarines.font.png'),
		size: { x: 117, y: 48 },
		maxVel: { x: 0, y: 0 },
		animSheet: new ig.AnimationSheet('media/img/ui-cash.png', 117, 48),
		type: ig.Entity.TYPE.NONE,
		init: function(x, y, settings) {
			this.addAnim('idle', 0.1, [0]);
			this.parent(x, y, settings);
		},
		update: function() {
			this.parent();
		},
		draw: function() {
			this.parent();
			this.font.draw(ig.game.coins, this.pos.x+80-ig.game.screen.x, this.pos.y+24, ig.Font.ALIGN.CENTER);
		}
	});
});