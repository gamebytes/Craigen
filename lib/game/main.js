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
	'game.entities.segment',
	'game.entities.monster',
	'game.entities.player',
	'game.entities.ui',
	'game.entities.screen'
)
.defines(function(){
// The actual Game source
GameScreen = ig.Game.extend({
	clearColor: null,
	gravity: 800,
	player: null,
	gameOver: false,
	gamePaused: false,
	gameCompleted: false,
	maxScore: 2000,
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
	screenZeroPos: null,
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
		this.player = this.spawnEntity(EntityPlayer, 20, 10);
		this.UIScore = this.spawnEntity(EntityUIScore, ig.system.width-103-5+this.screen.x, ig.system.height-34-5);
		this.BtnPause = this.spawnEntity(EntityButtonPause, 5+this.screen.x, 5);
		this.BtnAudio = this.spawnEntity(EntityButtonAudio, ig.system.width-47-5+this.screen.x, 5);

		if(ig.Sound.enabled) {
			this.BtnAudio.currentAnim = this.BtnAudio.anims['true'];
		}
		else {
			this.BtnAudio.currentAnim = this.BtnAudio.anims['false'];
		}
		// ig.game.player.vel.y = 0;
		this.oldHighscore = ig.game.storage.get('craigen-highscore');
		this.settingTheScore = false;

		// Retry fix - copy array instead of assigning it
		for(var i=0,len1=MapStarter.length; i<len1; i++) {
			this.map[i] = [];
			for(var j=0,len2=MapStarter[i].length; j<len2; j++) {
				this.map[i][j] = MapStarter[i][j];
			}
		}
		// console.dir(this.map);
		// console.dir(MapStarter);

		this.tileSize = 64;
		this.collisionMap = new ig.CollisionMap(this.tileSize, this.map, {});
		this.backgroundMaps.push( new ig.BackgroundMap(this.tileSize, this.map, 'media/img/tiles.png'));

		this.spawningTable = {
			goblin: EntityMonsterGoblin,
			skeleton: EntityMonsterSkeleton,
			vulture: EntityMonsterVulture,
			bat: EntityMonsterBat,
			ork: EntityMonsterOrk,
			wolf: EntityMonsterWolf,
			spikes: EntityItemSpikes
		};
		this.monsterGroups = {
			s: ['skeleton','ork'], // SHORT
			l: ['goblin','wolf'], // LONG
			f: ['bat','vulture'] // FLY
		};
		this.spawnMonster(16-15,'skeleton');
		this.spawnMonster(20-15,'wolf');
		this.spawnMonster(26-15,'goblin');
		this.spawnMonster(34-15,'ork');
	},
	populateSegment: function() {
		for(var x=0; x<2; x++) {
			var position = Math.floor(Math.random()*20);
			var monster = this.monsterGroups.f[Math.floor(Math.random()*this.monsterGroups.f.length)];
			this.spawnMonster(position,monster);
		}
		var group = '',
			monster = '';
		for(var i=0; i<20;i++) {
			group = MonsterSpawns[this.segmentID][i];
			if(group) {
				monster = this.monsterGroups[group][Math.floor(Math.random()*this.monsterGroups[group].length)];
				this.spawnMonster(i+1,monster);
			}
		}
	},
	spawnMonster: function(x,monster) {
		var x = (x+5)*this.tileSize, // 5 - offset difference between starter and segments
			altitude = 0,
			offset = 0;
		if(monster) {
			if(monster == 'bat' || monster == 'vulture') {
				altitude = Math.floor(Math.random()*ig.system.height);
			}
			var spawningEntity = this.spawningTable[monster];
		}
		// else {
		// 	var r = Math.floor(Math.random()*7);
		// 	switch(r) {
		// 		case 0: { var spawningEntity = EntityMonsterGoblin; break; }
		// 		case 1: { var spawningEntity = EntityMonsterSkeleton; break; }
		// 		case 2: { altitude = Math.floor(Math.random()*ig.system.height);
		// 			var spawningEntity = EntityMonsterVulture; break; }
		// 		case 3: { altitude = Math.floor(Math.random()*ig.system.height);
		// 			var spawningEntity = EntityMonsterBat; break; }
		// 		case 4: { var spawningEntity = EntityMonsterOrk; break; }
		// 		case 5: { var spawningEntity = EntityMonsterWolf; break; }
		// 		case 6: { var spawningEntity = EntityItemSpikes; break; }
		// 	}
		// }
		this.spawnEntity(spawningEntity,ig.system.width+this.screen.x+x+offset, altitude);
		// console.log('Spawn monster '+monster+' on pos '+x);
	},
	removeFragment: function(array) {
		for(var x=0; x<20; x++) {
			for(var i=0,len=array.length; i<len; i++) {
					array[i].shift();
			}
		}
	},
	addFragment: function(array) {
		this.segments = MapSegments;
		this.segmentID = Math.floor(Math.random()*this.segments.length); 
		for(var i=0; i<5; i++) {
			array[i] = (array[i]).concat(this.segments[this.segmentID][i]);
		}
		// console.log('New segment id: '+this.segmentID);
	},
	update: function() {
		if(this.score >= this.maxScore) {
			// GAME COMPLETED
			if(!this.BtnCompleted) {
				this.BtnCompleted = this.spawnEntity(EntityButtonBack, 10+this.screen.x, ig.system.height-58-10);
			}
			this.BtnCompleted.update();
		}
		else if(this.gamePaused) {
			// GAME PAUSED
			if(!this.BtnBack) {
				this.BtnBack = this.spawnEntity(EntityButtonBack, 5+this.screen.x, ig.system.height-58-5);
			}
			else {
				this.BtnBack.pos.x = 5+this.screen.x;
				this.BtnBack.pos.y = ig.system.height-58-5;
			}
			if(!this.BtnRetry) {
				this.BtnRetry = this.spawnEntity(EntityButtonRetry, ig.system.width-179-10+this.screen.x, ig.system.height-58-5);
			}
			else {
				this.BtnRetry.pos.x = ig.system.width-179-10+this.screen.x;
				this.BtnRetry.pos.y = ig.system.height-58-5;
			}
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
			if(!this.BtnBack) {
				this.BtnBack = this.spawnEntity(EntityButtonBack, 5+this.screen.x, ig.system.height-58-5);
			}
			else {
				this.BtnBack.pos.x = 5+this.screen.x;
				this.BtnBack.pos.y = ig.system.height-58-5;
			}
			if(!this.BtnRetry) {
				this.BtnRetry = this.spawnEntity(EntityButtonRetry, ig.system.width-179-10+this.screen.x, ig.system.height-58-5);
			}
			else {
				this.BtnRetry.pos.x = ig.system.width-179-10+this.screen.x;
				this.BtnRetry.pos.y = ig.system.height-58-5;
			}
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
				var delta = 20;
				// Do we need a new map fragment?
				if(this.screen.x > this.tileSize*delta) {
					// console.log('BOOM!');
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

				if(this.player.pos.x-this.screen.x+this.player.size.x < ig.system.width/2) {
					this.player.vel.x = 170;
				}
				else {
					this.player.vel.x = 100;
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
			if(this.BtnCompleted) {
				this.BtnCompleted.draw(0,0);
			}
		}
		else if(this.gamePaused) {
			// GAME PAUSED
			this.gamePausedScreen.draw(0,0);
			if(this.BtnBack) {
				this.BtnBack.pos.x = 5+this.screen.x;
				this.BtnBack.draw();
			}
			if(this.BtnRetry) {
				this.BtnRetry.pos.x = ig.system.width-179-10+this.screen.x;
				this.BtnRetry.draw();
			}
		}
		else if(this.gameOver) {
			// GAME OVER
			var x = (ig.system.width-388)/2;
			var y = ((ig.system.height-103)/2)-60;
			this.gameOverText.draw(x,y);
			if(this.BtnRetry) {
				this.BtnRetry.pos.x = ig.system.width-179-10+this.screen.x;
				this.BtnRetry.draw();
			}
			if(this.BtnBack) {
				this.BtnBack.pos.x = 5+this.screen.x;
				this.BtnBack.draw();
			}
			this.gameOverScore.draw((ig.system.width-207)/2,((ig.system.height-67)/2)+45);
			this.font.draw(this.score.floor().toString()+" m", ig.system.width/2, (ig.system.height/2)+40, ig.Font.ALIGN.CENTER);
			var highscore = this.oldHighscore;
			if(this.score > this.oldHighscore) {
				this.gameOverHighscore.draw(ig.system.width-100, 150);
			}
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
// if(ig.ua.iOS) {
// 	ig.Sound.enabled = false;
// }

checkOrientation = function() {
	if(ig.ua.mobile && (window.orientation == 0 || window.orientation == 180)) {
		document.getElementById('portrait').style.display = 'block';
		document.getElementById('game').style.display = 'none';
	}
	else {
		document.getElementById('portrait').style.display = 'none';
		document.getElementById('game').style.display = 'block';
		// hideAddressBar();
	}
}

if(ig.ua.mobile && (window.orientation == 0 || window.orientation == 180)) {
	document.getElementById('portrait').style.display = 'block';
	document.getElementById('game').style.display = 'none';
}

function hideURLbar() {
	if (window.location.hash.indexOf('#') == -1) {
		window.scrollTo(0, 1);
	}
	ig.CanvasCSS3Scaling.reflow();
}
if(navigator.userAgent.indexOf('iPhone') != -1 || navigator.userAgent.indexOf('Android') != -1) {
    addEventListener("load", function() {
            setTimeout(hideURLbar, 0);
            setTimeout(ig.CanvasCSS3Scaling.reflow,50);
    }, false);
}

window.addEventListener("orientationchange", checkOrientation);

ig.CanvasCSS3Scaling = new CanvasCSS3Scaling();
ig.CanvasCSS3Scaling.init();

ig.main('#canvas', StartScreen, 30, 480, 320, 1, ig.ImpactSplashLoader);
});