ig.module(
	'game.entities.screen'
)
.requires(
	'impact.game',
	'impact.entity',
	'impact.sound'
)
.defines(function(){
	// Start Screen
	StartScreen = ig.Game.extend({
		clearColor: null, // don't clear the screen
		font: new ig.Font('media/telemarines.font.png'),
		parallaxIceMountains: new ig.Image('media/img/parallax-icemountains.png'),
		parallaxMountains: new ig.Image('media/img/parallax-mountains.png'),
		parallaxRocks: new ig.Image('media/img/parallax-rocks.png'),
		parallaxSky: new ig.Image('media/img/parallax-sky.png'),
		// bestScore: new ig.Image('media/img/gameover-best.png'),
		storage: new ig.Storage(),
		counter: 0,
		parallax: null,
		init: function() {
			this.storage.initUnset('craigen-highscore',0);
			ig.input.bind(ig.KEY.SPACE, 'start');
			ig.input.bind(ig.KEY.ENTER, 'start');
			ig.input.bind(ig.KEY.MOUSE1, 'click');
			ig.input.bind(ig.KEY.H, 'howTo');
			this.parallax = new Parallax();
			this.parallax.add(this.parallaxSky.path, {distance: 10, y: 0});
			this.parallax.add(this.parallaxIceMountains.path, {distance: 7, y: 50});
			this.parallax.add(this.parallaxMountains.path, {distance: 4, y: 110});
			this.parallax.add(this.parallaxRocks.path, {distance: 1, y: 180});
			this.BtnStart = this.spawnEntity(EntityButtonStart, ig.system.width-183-10, ig.system.height-60-10);
			this.BtnAudio = this.spawnEntity(EntityButtonAudio, ig.system.width-42-5, 5);
			// this.BtnEnclave = this.spawnEntity(EntityButtonEnclave, 5, 5);

			if(!ig.ua.iOS && ig.game.storage.isCapable()) {
				ig.Sound.enabled = ig.game.storage.get('craigen-audio');
			}
			ig.music.add('media/audio/theme-music.*');
			ig.music.volume = 0.7;
			if(ig.Sound.enabled) {
				ig.music.play();
				this.BtnAudio.currentAnim = this.BtnAudio.anims['true'];
			}
			else {
				this.BtnAudio.currentAnim = this.BtnAudio.anims['false'];
			}
			this.oldHighscore = ig.game.storage.get('craigen-highscore');
		},
		update: function() {
			if(ig.input.pressed('start')) {
				ig.system.setGame(GameScreen);
			}
			// this.counter++;
			this.parallax.move(0);
			this.parent();
		},
		draw: function() {
			this.parent();
			this.parallax.draw();
			this.BtnStart.draw();
			this.BtnAudio.draw();
			// this.BtnEnclave.draw();
		}
	});

	// StoryScreen = ig.Game.extend({
	// 	story: new ig.Image('media/img/screen-story.png'),
	// 	buttonContinue: new ig.Image('media/img/button-continue.png'),
	// 	init: function() {
	// 		ig.input.bind(ig.KEY.SPACE, 'start');
	// 		ig.input.bind(ig.KEY.ENTER, 'start');
	// 		ig.input.bind(ig.KEY.MOUSE1, 'start');
	// 	},
	// 	update: function() {
	// 		if(ig.input.pressed('start')) {
	// 			ig.system.setGame(HowToScreen);
	// 		}
	// 		this.parent();
	// 	},
	// 	draw: function() {
	// 		this.parent();
	// 		this.story.draw(0,0);
	// 		this.buttonContinue.draw(ig.system.width-146-10,ig.system.height-43-10);
	// 	}
	// });

	// HowToScreen = ig.Game.extend({
	// 	howTo: new ig.Image('media/img/screen-howto.png'),
	// 	buttonContinue: new ig.Image('media/img/button-continue.png'),
	// 	init: function() {
	// 		ig.input.bind(ig.KEY.SPACE, 'start');
	// 		ig.input.bind(ig.KEY.ENTER, 'start');
	// 		ig.input.bind(ig.KEY.MOUSE1, 'start');
	// 		ig.input.bind(ig.KEY.H, 'howTo');
	// 	},
	// 	update: function() {
	// 		if(ig.input.pressed('howTo')) {
	// 			ig.system.setGame(StartScreen);
	// 		}
	// 		if(ig.input.pressed('start')) {
	// 			ig.system.setGame(GameScreen);
	// 		}
	// 		this.parent();
	// 	},
	// 	draw: function() {
	// 		this.parent();
	// 		this.howTo.draw(0,0);
	// 		this.buttonContinue.draw(ig.system.width-146-10,ig.system.height-43-10);
	// 	}
	// });
});