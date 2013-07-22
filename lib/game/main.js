ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.entity',
	'impact.font',
	'plugins.parallax',
	'plugins.impact-splash-loader',
	'plugins.canvas-css3-scaling',
	'plugins.impact-storage',
	'game.entities.button',
	// 'game.entities.item',
	'game.entities.player',
	'game.entities.ui',
	'game.entities.screen'
)
.defines(function(){
// The actual Game source
GameScreen = ig.Game.extend({
	clearColor: null, // don't clear the screen
	gravity: 250,
	player: null,
	gameOver: false,
	gamePaused: false,
	gameCompleted: false,
	maxScore: 20000,
	score: 0,
	speed: 1.5,
	seconds: null,
	secondsTimer: null,
	font: new ig.Font('media/telemarines.font.png'),
	parallaxIceMountains: new ig.Image('media/img/parallax-icemountains.png'),
	parallaxMountains: new ig.Image('media/img/parallax-mountains.png'),
	parallaxRocks: new ig.Image('media/img/parallax-rocks.png'),
	parallaxSky: new ig.Image('media/img/parallax-sky.png'),
	gameOverScreen: new ig.Image('media/img/screen-gameover.png'),
	gameOverScore: new ig.Image('media/img/gameover-score.png'),
	gameOverBest: new ig.Image('media/img/gameover-best.png'),
	gameOverHighscore: new ig.Image('media/img/gameover-highscore.png'),
	gamePausedScreen: new ig.Image('media/img/screen-pause.png'),
	gameCompletedScreen: new ig.Image('media/img/screen-gamecompleted.png'),
	storage: new ig.Storage(),
	parallax: null,
	init: function() {
		ig.input.bind(ig.KEY.UP_ARROW, 'up');
		ig.input.bind(ig.KEY.MOUSE1, 'click');
		ig.input.bind(ig.KEY.ENTER, 'ok');
		ig.input.bind(ig.KEY.P, 'pause');
		this.secondsTimer = new ig.Timer(1);
		this.parallax = new Parallax();
		this.parallax.add(this.parallaxSky.path, {distance: 1000, y: 0});
		this.parallax.add(this.parallaxIceMountains.path, {distance: 1000, y: 50});
		this.parallax.add(this.parallaxMountains.path, {distance: 3, y: 110});
		this.parallax.add(this.parallaxRocks.path, {distance: 1, y: 180});
		this.player = this.spawnEntity(EntityPlayer, 60, 100);
		this.UICash = this.spawnEntity(EntityUICash, 5, ig.system.height-48-5);
		this.UIScore = this.spawnEntity(EntityUIScore, ig.system.width-150-5, ig.system.height-20-5);
		this.BtnPause = this.spawnEntity(EntityButtonPause, 5, 5);
		this.BtnAudio = this.spawnEntity(EntityButtonAudio, ig.system.width-42-5, 5);

		if(ig.Sound.enabled) {
			this.BtnAudio.currentAnim = this.BtnAudio.anims['true'];
		}
		else {
			this.BtnAudio.currentAnim = this.BtnAudio.anims['false'];
		}
		// this.newItemTable();
		ig.game.player.vel.y = 0;
		this.oldHighscore = ig.game.storage.get('craigen-highscore');
		this.settingTheScore = false;
	},
	placeEntity: function(entity) {
		var x = ig.system.width+50;
		var y = Math.random()*ig.system.height;
		var item = this.spawnEntity(entity, x, y);
			item.speed = ig.game.speed + Math.random()*ig.game.speed/2 - Math.random()*ig.game.speed/2;
		if(y > ig.system.height-item.size.y)
			item.pos.y = ig.system.height-item.size.y;
	},
	shuffleArray: function(array) {
		var len = array.length;
		var i = len;
		while (i--) {
			var p = parseInt(Math.random()*len);
			var t = array[i];
			array[i] = array[p];
			array[p] = t;
		}
	},
	update: function() {
		if(this.score >= this.maxScore) {
			// GAME COMPLETED
			if(!this.BtnCompleted) {
				this.BtnCompleted = this.spawnEntity(EntityButtonBack, ig.system.width-206-10, ig.system.height-58-10);
			}
			this.BtnCompleted.update();
		}
		else if(this.gamePaused) {
			// GAME PAUSED
			if(!this.BtnRestart)
				this.BtnRestart = this.spawnEntity(EntityButtonRestart, 10, ig.system.height-58-10);
			if(!this.BtnBack)
				this.BtnBack = this.spawnEntity(EntityButtonBack, ig.system.width-206-10, ig.system.height-58-10);
			this.BtnRestart.update();
			this.BtnBack.update();
			if(ig.input.pressed('click')) {
				this.gamePaused = false;
				ig.game.player.vel.y = 0;
				this.BtnBack.kill();
				this.BtnRestart.kill();
			}
		}
		else if(this.gameOver) {
			// GAME OVER
			if(!this.BtnRestart)
				this.BtnRestart = this.spawnEntity(EntityButtonRestart, 10, ig.system.height-58-10);
			if(!this.BtnBack)
				this.BtnBack = this.spawnEntity(EntityButtonBack, ig.system.width-206-10, ig.system.height-58-10);
			this.BtnRestart.update();
			this.BtnBack.update();
			this.BtnAudio.update();
			var newHighscore = (this.score).floor();
			if(newHighscore > this.oldHighscore && !this.settingTheScore) {
				ig.game.storage.setHighest('craigen-highscore',newHighscore);
				this.settingTheScore = true;
			}
		}
		else {
			if(ig.input.pressed('ok')) {
				ig.system.setGame(GameScreen);
			}
			else {
				if(ig.input.pressed('pause')) {
					this.gamePaused = !this.gamePaused;
				}

				// add speed to the fixed (high) amount, but leave it there
				this.speed += 0.0005;
				this.score += ig.system.tick*this.speed*5;

				for(var i = 0; i < this.entities.length; i++) {
					if(this.entities[i].type == ig.Entity.TYPE.B)
						this.entities[i].pos.x -= this.entities[i].speed;
				}
				this.tickCount = Math.ceil(this.score/1000);
				// if(this.secondsTimer.delta() > 0) {
				// 	ig.game.seconds++;
				// 	this.secondsTimer.reset();
				// 	for (var i=0; i<this.tickCount; i++) {
				// 		if(!this.entityItemTable.length) {
				// 			this.newItemTable();
				// 		}
				// 		this.placeEntity(this.entityItemTable.pop());
				// 	}
				// }
				this.parallax.move(40*this.speed);
				this.parent();
				
				// check for gameover
				if(this.player.pos.y > ig.system.height+this.player.size.y) {
					this.gameOver = true;
					this.gameOverType = 'offscreen';
				}
			}
		}
	},
	draw: function() {
		if(this.score >= this.maxScore) {
			// GAME COMPLETED
			this.gameCompletedScreen.draw(0,0);
			if(this.BtnCompleted)
				this.BtnCompleted.draw();
		}
		else if(this.gamePaused) {
			// GAME PAUSED
			this.gamePausedScreen.draw(0,0);
			if(this.BtnRestart)
				this.BtnRestart.draw();
			if(this.BtnBack)
				this.BtnBack.draw();
		}
		else if(this.gameOver) {
			// GAME OVER
			var x = (ig.system.width-254)/2;
			var y = ((ig.system.height-147)/2)-30;
			this.gameOverScreen.draw(x,y);
			if(this.BtnRestart)
				this.BtnRestart.draw();
			if(this.BtnBack)
				this.BtnBack.draw();
			if(this.BtnAudio)
				this.BtnAudio.draw();
			this.gameOverScore.draw(10,80);
			this.gameOverBest.draw(ig.system.width-10-121,80);
			this.font.draw(this.score.floor().toString(), 115, 113, ig.Font.ALIGN.RIGHT);
			var highscore = this.oldHighscore;
			if(this.score > this.oldHighscore) {
				this.gameOverHighscore.draw(ig.system.width-22-96, 142);
				var highscore = this.score.floor().toString();
			}
			this.font.draw(highscore, ig.system.width-22, 112, ig.Font.ALIGN.RIGHT);
		}
		else {
			this.parallax.draw();
			this.parent();
			this.UICash.draw();
			this.UIScore.draw();
			this.BtnPause.draw();
			this.BtnAudio.draw();
		}
	}
});

if(ig.ua.iOS) {
	ig.Sound.enabled = false;
}
ig.CanvasCSS3Scaling = new CanvasCSS3Scaling();
ig.CanvasCSS3Scaling.init();

ig.main('#canvas', StartScreen, 30, 480, 320, 1, ig.ImpactSplashLoader);
});