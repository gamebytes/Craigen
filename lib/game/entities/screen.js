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
		font: new ig.Font('media/treasure-map-deadhand.24px.font.png'),
		parallaxIceMountains: new ig.Image('media/img/parallax-icemountains.png'),
		parallaxMountains: new ig.Image('media/img/parallax-mountains.png'),
		parallaxRocks: new ig.Image('media/img/parallax-rocks.png'),
		parallaxSky: new ig.Image('media/img/parallax-sky.png'),
		// bestScore: new ig.Image('media/img/gameover-best.png'),
		craigen: new ig.Image('media/img/cover-craigen.png'),
		name: new ig.Image('media/img/cover-name.png'),
		title: new ig.Image('media/img/cover-title.png'),
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
			this.BtnStart = this.spawnEntity(EntityButtonStart, ig.system.width-194-5, ig.system.height-63-5);
			this.BtnAudio = this.spawnEntity(EntityButtonAudio, ig.system.width-47-5, 5);
			// this.BtnEnclave = this.spawnEntity(EntityButtonEnclave, 5, 5);
			this.UIHighscore = this.spawnEntity(EntityUIHighscore, 5, 5);

			if(!ig.ua.iOS && ig.game.storage.isCapable()) {
				ig.Sound.enabled = ig.game.storage.get('craigen-audio');
			}
			// ig.music.add('media/audio/theme-music.*');
			// ig.music.volume = 0.7;
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
				ig.system.setGame(StoryScreen);
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
			this.UIHighscore.draw();
			this.craigen.draw(0,ig.system.height-237);
			this.name.draw(ig.system.width-166-30,65);
			this.title.draw(ig.system.width-211-5,105);
		}
	});

	StoryScreen = ig.Game.extend({
		story: [
			new ig.Image('media/img/screen-story1.png'),
			new ig.Image('media/img/screen-story2.png'),
			new ig.Image('media/img/screen-story3.png'),
			new ig.Image('media/img/screen-story4.png')
		],
		storyCounter: 0,
		init: function() {
			ig.input.bind(ig.KEY.SPACE, 'start');
			ig.input.bind(ig.KEY.ENTER, 'start');
			// ig.input.bind(ig.KEY.MOUSE1, 'start');
			this.BtnSkip = this.spawnEntity(EntityButtonSkip, ig.system.width-179-5, ig.system.height-58-5);
			this.BtnContinue = this.spawnEntity(EntityButtonContinue, 5, ig.system.height-58-5);
		},
		update: function() {
			this.parent();
		},
		draw: function() {
			this.parent();
			if(this.storyCounter < 4)
				this.story[this.storyCounter].draw(0,0);
			this.BtnSkip.draw();
			this.BtnContinue.draw();
		}
	});

	HowToScreen = ig.Game.extend({
		font: new ig.Font('media/treasure-map-deadhand.24px.font.png'),
		howTo: new ig.Image('media/img/screen-howtoplay.png'),
		buttonContinue: new ig.Image('media/img/button-continue.png'),
		init: function() {
			ig.input.bind(ig.KEY.SPACE, 'start');
			ig.input.bind(ig.KEY.ENTER, 'start');
			ig.input.bind(ig.KEY.MOUSE1, 'start');
		},
		update: function() {
			if(ig.input.pressed('start')) {
				ig.system.setGame(GameScreen);
			}
			this.parent();
		},
		draw: function() {
			this.parent();
			this.howTo.draw(0,0);
			this.buttonContinue.draw(ig.system.width-179-5,ig.system.height-58-5);
			this.font.draw("Up or Z - Jump", 25, ig.system.height-65, ig.Font.ALIGN.LEFT);
			this.font.draw("X or Space - Attack", 20, ig.system.height-35, ig.Font.ALIGN.LEFT);
		}
	});
});