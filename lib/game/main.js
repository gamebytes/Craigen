ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.entity',
	'impact.font',
	'impact.collision-map',
	'impact.background-map',
	'plugins.parallax',
	'plugins.impact-splash-loader',
	'plugins.canvas-css3-scaling',
	'plugins.impact-storage',
	'game.entities.button',
	'game.entities.item',
	// 'impact.debug.debug',
	'game.entities.monster',
	'game.entities.player',
	'game.entities.ui',
	'game.entities.screen'
)
.defines(function(){
// The actual Game source
GameScreen = ig.Game.extend({
	clearColor: null, // don't clear the screen
	gravity: 800,
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
	map: [],
	coins: 0,
	init: function() {
		ig.input.bind(ig.KEY.UP_ARROW, 'up');
		ig.input.bind(ig.KEY.MOUSE1, 'click');
		ig.input.bind(ig.KEY.ENTER, 'ok');
		ig.input.bind(ig.KEY.P, 'pause');
		ig.input.bind(ig.KEY.X, 'attack');
		this.secondsTimer = new ig.Timer(1);
		this.parallax = new Parallax();
		this.parallax.add(this.parallaxSky.path, {distance: 1000, y: 0});
		this.parallax.add(this.parallaxIceMountains.path, {distance: 1000, y: 50});
		this.parallax.add(this.parallaxMountains.path, {distance: 3, y: 110});
		this.parallax.add(this.parallaxRocks.path, {distance: 1, y: 180});
		this.player = this.spawnEntity(EntityPlayer, 70, 10);
		this.UICash = this.spawnEntity(EntityUICash, 2, ig.system.height-48-2);
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

		this.map = [
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		];
		// for(var y=8; y<18; y++) {	
		// 	this.map[y] = this.generateRow();
		// }
		this.tileSize = 40;
		this.mapSize = 16;
		this.collisionMap = new ig.CollisionMap(this.tileSize, this.map);
		this.backgroundMaps.push( new ig.BackgroundMap(this.tileSize, this.map, 'media/img/tiles.png'));
		// this.rotateArray('ccw',this.map);
	},
	generateRow: function() {
		var row = [];
		for(var x=1; x<this.mapSize; x++) {
			row[x] = Math.random() > 0.93 ? 1 : 0;
			if(row[x-1] == 1 && row[x] == 0) {
				if(Math.random() < 0.8) {
					// row[x] = 2;
					// PLACE A COIN
					// this.spawnEntity(EntityItemCoin,ig.system.width+this.screen.x,this.tileSize*(x-2));
				}
			}
		}
		row[8] = 1;
		row[15] = 0;

		if(Math.random() > 0.5) {
			var rand = Math.random();
			if(rand < 0.33) {
				this.spawnEntity(EntityItemCoin,ig.system.width+this.screen.x,this.tileSize*6);
			}
			else if(rand < 0.66) {
				this.spawnEntity(EntityItemSpikes,ig.system.width+this.screen.x,this.tileSize*6);
			}
			else { // if(rand < 0.66)
				var r = Math.floor(Math.random()*4);
				var altitude = this.tileSize*6;
				switch(r) {
					case 0: {
						var spawningEntity = EntityMonsterGoblin;
						break;
					}
					case 1: {
						var spawningEntity = EntityMonsterSkeleton;
						break;
					}
					case 2: {
						var spawningEntity = EntityMonsterVulture;
						var altitude = Math.floor(Math.random()*ig.system.height);
						break;
					}
					case 3: {
						var spawningEntity = EntityMonsterWolf;
						break;
					}
				}
				this.spawnEntity(spawningEntity,ig.system.width+this.screen.x,altitude);
			}
		}

		return row;
	},
	rotateArray: function(dir,a) {
		var n = a.length;
		if(dir == 'ccw') { // counter clockwise
			for(var i=0; i<n/2; i++) {
				for(var j=i; j<n-i-1; j++) {
					var tmp = a[i][j];
					a[i][j] = a[j][n-i-1];
					a[j][n-i-1] = a[n-i-1][n-j-1];
					a[n-i-1][n-j-1] = a[n-j-1][i];
					a[n-j-1][i] = tmp;
				}
			}
		}
		else { // 'cw' - clockwise
			for(var i=0; i<n/2; i++) {
				for(var j=i; j<n-i-1; j++) {
					var tmp = a[i][j];
					a[i][j] = a[n-j-1][i];
					a[n-j-1][i] = a[n-i-1][n-j-1];
					a[n-i-1][n-j-1] = a[j][n-i-1];
					a[j][n-i-1] = tmp;
				}
			}
		}
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

				// Do we need a new row?
				if( this.screen.x > 40 ) {
					
					// Move screen and entities one tile up
					this.screen.x -= this.tileSize;
					for( var i =0; i < this.entities.length; i++ ) {
						this.entities[i].pos.x -= this.tileSize;
					}
					
					this.rotateArray('cw',this.map);

					// Delete first row, insert new
					this.map.shift();
					this.map.push(this.generateRow());

					this.rotateArray('ccw',this.map);
					
					// Place coin?
					// if( Math.random() > 0.5 ) {
					// 	this.placeCoin();
					// }
				}

				// add speed to the fixed (high) amount, but leave it there
				this.speed += 0.0005;
				this.screen.x += this.speed;
				this.score += ig.system.tick*this.speed*5;

				//

				for(var i = 0; i < this.entities.length; i++) {
					if(this.entities[i].type == ig.Entity.TYPE.NONE)
						// this.entities[i].pos.x -= this.entities[i].speed;
						this.entities[i].pos.x += this.speed;
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