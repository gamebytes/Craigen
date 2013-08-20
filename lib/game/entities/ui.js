ig.module(
	'game.entities.ui'
)
.requires(
	'impact.entity'
)
.defines(function(){
	// The UI Score Entity
	EntityUIScore = ig.Entity.extend({
		font: new ig.Font('media/treasure-map-deadhand.24px.font.png'),
		size: { x: 103, y: 34 },
		maxVel: { x: 0, y: 0 },
		animSheet: new ig.AnimationSheet('media/img/ui-score.png', 103, 34),
		type: ig.Entity.TYPE.NONE,
		init: function(x, y, settings) {
			this.addAnim('idle', 0.1, [0]);
			this.parent(x, y, settings);
			// ig.game.score = 1000;
		},
		draw: function() {
			this.parent();
			this.font.draw(ig.game.score.floor().toString(), this.pos.x+103-ig.game.screen.x-12, this.pos.y+7, ig.Font.ALIGN.RIGHT);
		}
	});
	// The UI Highscore Entity
	EntityUIHighscore = ig.Entity.extend({
		font: new ig.Font('media/treasure-map-deadhand.24px.font.png'),
		size: { x: 134, y: 44 },
		maxVel: { x: 0, y: 0 },
		animSheet: new ig.AnimationSheet('media/img/ui-highscore.png', 134, 44),
		type: ig.Entity.TYPE.NONE,
		init: function(x, y, settings) {
			this.addAnim('idle', 0.1, [0]);
			this.parent(x, y, settings);
			// ig.game.highscore = 1000;
		},
		draw: function() {
			this.parent();
			this.font.draw(ig.game.oldHighscore.floor().toString()+" m", this.pos.x+70-ig.game.screen.x, this.pos.y+15, ig.Font.ALIGN.CENTER);
		}
	});
	// The UI Cash Entity
	// EntityUICash = ig.Entity.extend({
	// 	font: new ig.Font('media/treasure-map-deadhand.24px.font.png'),
	// 	size: { x: 117, y: 48 },
	// 	maxVel: { x: 0, y: 0 },
	// 	animSheet: new ig.AnimationSheet('media/img/ui-cash.png', 117, 48),
	// 	type: ig.Entity.TYPE.NONE,
	// 	init: function(x, y, settings) {
	// 		this.addAnim('idle', 0.1, [0]);
	// 		this.parent(x, y, settings);
	// 	},
	// 	update: function() {
	// 		this.parent();
	// 	},
	// 	draw: function() {
	// 		this.parent();
	// 		this.font.draw(ig.game.coins, this.pos.x+80-ig.game.screen.x, this.pos.y+24, ig.Font.ALIGN.CENTER);
	// 	}
	// });
});