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
		size: { x: 150, y: 20 },
		maxVel: { x: 0, y: 0 },
		animSheet: new ig.AnimationSheet('media/img/ui-score.png', 150, 20),
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
			this.font.draw(ig.game.score.floor().toString(), this.pos.x+140, this.pos.y+5, ig.Font.ALIGN.RIGHT);
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
			this.font.draw(364, this.pos.x+80, this.pos.y+24, ig.Font.ALIGN.CENTER);
		}
	});
});