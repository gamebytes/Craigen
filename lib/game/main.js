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
	'game.entities.segment',
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
	speed: 2.2,
	seconds: null,
	secondsTimer: null,
	font: new ig.Font('media/treasure-map-deadhand.24px.font.png'),
	parallaxIceMountains: new ig.Image('media/img/parallax-icemountains.png'),
	parallaxMountains: new ig.Image('media/img/parallax-mountains.png'),
	parallaxRocks: new ig.Image('media/img/parallax-rocks.png'),
	parallaxSky: new ig.Image('media/img/parallax-sky.png'),
	gameOverText: new ig.Image('media/img/gameover-text.png'),
	gameOverScore: new ig.Image('media/img/gameover-score.png'),
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
		this.player = this.spawnEntity(EntityPlayer, 120, 110);
		// this.UICash = this.spawnEntity(EntityUICash, 2, ig.system.height-48-2);
		this.UIScore = this.spawnEntity(EntityUIScore, ig.system.width-103-5+this.screen.x*2, ig.system.height-34-5);
		this.BtnPause = this.spawnEntity(EntityButtonPause, 5+this.screen.x*2, 5);
		this.BtnAudio = this.spawnEntity(EntityButtonAudio, ig.system.width-47-5+this.screen.x*2, 5);

		if(ig.Sound.enabled) {
			this.BtnAudio.currentAnim = this.BtnAudio.anims['true'];
		}
		else {
			this.BtnAudio.currentAnim = this.BtnAudio.anims['false'];
		}
		// ig.game.player.vel.y = 0;
		this.oldHighscore = ig.game.storage.get('craigen-highscore');
		this.settingTheScore = false;

		this.map = MapStarter;
		this.tileSize = 64;
		this.collisionMap = new ig.CollisionMap(this.tileSize, this.map, {});
		this.backgroundMaps.push( new ig.BackgroundMap(this.tileSize, this.map, 'media/img/tiles.png'));
		// this.rotateArray('ccw',this.map);

		this.spawnMonster(3);
		this.spawnMonster(8);
		this.spawnMonster(10);
		this.spawnMonster(15);
		this.spawnMonster(18);
	},
	populateSegment: function() {
		// populate segment
		console.log('populateSegment');
		for(var i=0; i<20; i++) {
			this.spawnMonster(20+i);
		}
	},
	spawnMonster: function(x) {
		var x = x*this.tileSize;
		console.log('spawn monster:');

		var altitude = 0;
		var offset = 0;
		// var rand = Math.random();
		// console.log(rand);
		// if(rand < 0.5) {
			var r = Math.floor(Math.random()*7);
			switch(r) {
				case 0: {
					var spawningEntity = EntityMonsterGoblin;
					console.log('EntityMonsterGoblin');
					break;
				}
				case 1: {
					var spawningEntity = EntityMonsterSkeleton;
					console.log('EntityMonsterSkeleton');
					break;
				}
				case 2: {
					var spawningEntity = EntityMonsterVulture;
					console.log('EntityMonsterVulture');
					var altitude = Math.floor(Math.random()*ig.system.height);
					break;
				}
				case 3: {
					var spawningEntity = EntityMonsterBat;
					console.log('EntityMonsterBat');
					var altitude = Math.floor(Math.random()*ig.system.height);
					break;
				}
				case 4: {
					var spawningEntity = EntityMonsterOrk;
					console.log('EntityMonsterOrk');
					break;
				}
				case 5: {
					var spawningEntity = EntityMonsterWolf;
					console.log('EntityMonsterWolf');
					break;
				}
				case 6: {
					var spawningEntity = EntityItemSpikes;
					console.log('EntityItemSpikes');
					var offset = (64-40)/2;
					break;
				}
			}
			this.spawnEntity(spawningEntity,ig.system.width+this.screen.x+x+offset, altitude);
			console.log('on pos '+x);
		// }
	},
	// generateRow: function() {
		// var row = [];
		// for(var x=1; x<this.mapSize; x++) {
		// 	row[x] = Math.random() > 0.93 ? 1 : 0;
		// 	if(row[x-1] == 1 && row[x] == 0) {
		// 		if(Math.random() < 0.8) {
		// 			// row[x] = 2;
		// 			// PLACE A COIN
		// 			// this.spawnEntity(EntityItemCoin,ig.system.width+this.screen.x,this.tileSize*(x-2));
		// 		}
		// 	}
		// }
		// row[8] = 1;
		// row[15] = 0;

		// return row;
	// },
	// generateFragment: function() {
	// 	// generate a map fragment
	// 	this.map1 = [
	// 		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// 		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	// 		[6,7,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0],
	// 		[2,8,7,0,0,4,0,0,6,1,0,0,6,5,7,0,0,0,6,7],
	// 		[2,8,8,7,0,3,0,6,8,1,0,6,8,8,8,5,7,0,2,1]
	// 	];
	// 	for(var z=5; z<20; z++) {	
	// 		this.map1[z] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	// 	}
	// 	// this.rotateArray('cw',this.map1);
	// 	// this.map = (this.map).concat(this.map1);
	// 	for(var y=0; y<20; y++) {
	// 		this.map.push(this.map1[y]);
	// 	}
	// },
	// rotateArray: function(dir,a) {
	// 	var n = a.length;
	// 	if(dir == 'ccw') { // counter clockwise
	// 		for(var i=0; i<n/2; i++) {
	// 			for(var j=i; j<n-i-1; j++) {
	// 				var tmp = a[i][j];
	// 				a[i][j] = a[j][n-i-1];
	// 				a[j][n-i-1] = a[n-i-1][n-j-1];
	// 				a[n-i-1][n-j-1] = a[n-j-1][i];
	// 				a[n-j-1][i] = tmp;
	// 			}
	// 		}
	// 	}
	// 	else { // 'cw' - clockwise
	// 		for(var i=0; i<n/2; i++) {
	// 			for(var j=i; j<n-i-1; j++) {
	// 				var tmp = a[i][j];
	// 				a[i][j] = a[n-j-1][i];
	// 				a[n-j-1][i] = a[n-i-1][n-j-1];
	// 				a[n-i-1][n-j-1] = a[j][n-i-1];
	// 				a[j][n-i-1] = tmp;
	// 			}
	// 		}
	// 	}
	// },
	// removeColumn: function(array) {
	// 	for(var i=0,len=array.length; i<len; i++) {
	// 			array[i].shift();
	// 	}
	// },
	// addColumn: function(array) {
	// 	// for(var i=0,len=array.length; i<len; i++) {
	// 	// 		array.push(0);
	// 	// }
	// 	array[0].push(0);
	// 	array[1].push(0);
	// 	array[2].push(0);
	// 	array[3].push(0);
	// 	array[4].push(8);
	// },
	removeFragment: function(array) {
		for(var x=0; x<20; x++) {
			for(var i=0,len=array.length; i<len; i++) {
					array[i].shift();
			}
		}
	},
	addFragment: function(array) {
		this.segments = MapSegments;
		var rand = Math.floor(Math.random()*this.segments.length); 
		for(var i=0; i<5; i++) {
			array[i] = (array[i]).concat(this.segments[rand][i]);
		}
		console.log('new fragment id: '+rand);
	},
	// placeEntity: function(entity) {
	// 	var x = ig.system.width+50;
	// 	var y = Math.random()*ig.system.height;
	// 	var item = this.spawnEntity(entity, x, y);
	// 		item.speed = ig.game.speed + Math.random()*ig.game.speed/2 - Math.random()*ig.game.speed/2;
	// 	if(y > ig.system.height-item.size.y)
	// 		item.pos.y = ig.system.height-item.size.y;
	// },
	// shuffleArray: function(array) {
	// 	var len = array.length;
	// 	var i = len;
	// 	while (i--) {
	// 		var p = parseInt(Math.random()*len);
	// 		var t = array[i];
	// 		array[i] = array[p];
	// 		array[p] = t;
	// 	}
	// },
	update: function() {
		if(this.score >= this.maxScore) {
			// GAME COMPLETED
			if(!this.BtnCompleted) {
				this.BtnCompleted = this.spawnEntity(EntityButtonBack, ig.system.width-179-10, ig.system.height-58-10);
			}
			this.BtnCompleted.update();
		}
		else if(this.gamePaused) {
			// GAME PAUSED
			if(!this.BtnBack)
				this.BtnBack = this.spawnEntity(EntityButtonBack, 5+this.screen.x, ig.system.height-58-5);
			if(!this.BtnRetry)
				this.BtnRetry = this.spawnEntity(EntityButtonRetry, ig.system.width-179-5+this.screen.x, ig.system.height-58-5);
			this.BtnBack.update();
			this.BtnRetry.update();
			if(ig.input.pressed('click')) {
				this.gamePaused = false;
				ig.game.player.vel.y = 0;
				this.BtnBack.kill();
				this.BtnRetry.kill();
			}
		}
		else if(this.gameOver) {
			// GAME OVER
			if(!this.BtnBack)
				this.BtnBack = this.spawnEntity(EntityButtonBack, 5+this.screen.x, ig.system.height-58-5);
			if(!this.BtnRetry)
				this.BtnRetry = this.spawnEntity(EntityButtonRetry, ig.system.width-179-5+this.screen.x, ig.system.height-58-5);
			this.BtnBack.update();
			this.BtnRetry.update();
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
				// if( this.screen.x > this.tileSize ) {
				// 	// Move screen and entities one tile up
				// 	this.screen.x -= this.tileSize;
				// 	for( var i =0; i < this.entities.length; i++ ) {
				// 		this.entities[i].pos.x -= this.tileSize;
				// 	}
				// 	this.rotateArray('cw',this.map);
				// 	// Delete first row, insert new
				// 	this.map.shift();
				// 	this.map.push(this.generateRow());
				// 	this.rotateArray('ccw',this.map);
				// 	// Place coin?
				// 	// if( Math.random() > 0.5 ) {
				// 	// 	this.placeCoin();
				// 	// }
				// }

				var delta = 20;
				// Do we need a new map fragment?
				if(this.screen.x > this.tileSize*delta) {
					// Move screen and entities one map up
					this.screen.x -= this.tileSize*delta;
					for(var i=0; i < this.entities.length; i++) {
						this.entities[i].pos.x -= this.tileSize*delta;
					}

					// console.log('1: '+this.map.length);
					// for(var i=0; i<5; i++) {
					// 	console.log(this.map[i]);
					// }
					
					this.removeFragment(this.map);
					this.addFragment(this.map);

					// spawn monsters on map
					// this.spawnMonster();
					this.populateSegment();
				}

				// add speed to the fixed (high) amount, but leave it there
				// this.speed += 0.0005;
				// this.screen.x += this.speed;
				this.score += ig.system.tick*this.speed*5;

				// for(var i = 0; i < this.entities.length; i++) {
				// 	if(this.entities[i].type == ig.Entity.TYPE.NONE)
				// 		// this.entities[i].pos.x -= this.entities[i].speed;
				// 		this.entities[i].pos.x += this.speed;
				// }
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

				for(var i=0; i < this.entities.length; i++) {
					if(this.entities[i].ui) {
						this.entities[i].pos.x += this.speed;
					}
				}

				ig.game.screen.x += this.speed;
				if(this.player.pos.x < (ig.system.width+this.screen.x)/2) {
					this.player.vel.x = 170;
				}
				else {
					this.player.vel.x = 130;
				}
				this.parallax.move(40*this.speed);
				this.parent();
				
				// // check for gameover
				if(this.player.pos.y > ig.system.height+this.player.size.y) {
					this.gameOver = true;
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
			if(this.BtnBack)
				this.BtnBack.draw();
			if(this.BtnRetry)
				this.BtnRetry.draw();
		}
		else if(this.gameOver) {
			// GAME OVER
			var x = (ig.system.width-388)/2;
			var y = ((ig.system.height-103)/2)-60;
			this.gameOverText.draw(x,y);
			if(this.BtnRetry)
				this.BtnRetry.draw();
			if(this.BtnBack)
				this.BtnBack.draw();
			if(this.BtnAudio)
				this.BtnAudio.draw();
			this.gameOverScore.draw((ig.system.width-207)/2,((ig.system.height-67)/2)+45);
			this.font.draw(this.score.floor().toString(), ig.system.width/2, (ig.system.height/2)+40, ig.Font.ALIGN.CENTER);
			var highscore = this.oldHighscore;
			// if(this.score > this.oldHighscore) {
				this.gameOverHighscore.draw(ig.system.width-100, 150);
			// }
		}
		else {
			this.parallax.draw();
			this.parent();
			// this.UICash.draw();
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