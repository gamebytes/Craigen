ig.module(
	'game.entities.button'
)
.requires(
	'impact.entity'
)
.defines(function(){
	// Buttons Entity
	EntityButton = ig.Entity.extend({
		sound: new ig.Sound('media/audio/button-click.*'),
		init: function(x, y, settings) {
			this.addAnim('idle', 0.1, [0]);
			// this.addAnim('hover', 0.1, [1]);
			this.parent(x, y, settings);
		},
		inFocus: function() {
			return (
				(this.pos.x <= (ig.input.mouse.x + ig.game.screen.x)) &&
				((ig.input.mouse.x + ig.game.screen.x) <= this.pos.x + this.size.x) &&
				(this.pos.y <= (ig.input.mouse.y + ig.game.screen.y)) &&
				((ig.input.mouse.y + ig.game.screen.y) <= this.pos.y + this.size.y)
			);
		}
	});
	EntityButtonStart = EntityButton.extend({
		size: { x: 183, y: 60 },
		animSheet: new ig.AnimationSheet('media/img/button-start.png', 183, 60),
		update: function() {
			if(ig.input.pressed('click') && this.inFocus()) {
				if(ig.Sound.enabled) {
					this.sound.play();
				}
				ig.system.setGame(GameScreen);
			}
		}
	});
	EntityButtonPause = EntityButton.extend({
		size: { x: 42, y: 44 },
		animSheet: new ig.AnimationSheet('media/img/button-pause.png', 42, 44),
		update: function() {
			if(ig.input.pressed('click') && this.inFocus()) {
				if(ig.Sound.enabled)
					this.sound.play();
				ig.game.gamePaused = !ig.game.gamePaused;
			}
		}
	});
	EntityButtonAudio = EntityButton.extend({
		size: { x: 42, y: 44 },
		animSheet: new ig.AnimationSheet('media/img/button-audio.png', 42, 44),
		init: function(x, y, settings) {
			this.addAnim('true', 0.1, [0]);
			this.addAnim('false', 0.1, [1]);
			this.parent(x, y, settings);
		},
		update: function() {
			if(ig.input.pressed('click') && this.inFocus()) {
				if(!ig.ua.iOS) {
					ig.Sound.enabled = !ig.Sound.enabled;
					if(ig.game.storage.isCapable())
						ig.game.storage.set('craigen-audio',ig.Sound.enabled);
					this.currentAnim = this.anims[(ig.Sound.enabled).toString()];
					if(ig.Sound.enabled) {
						ig.music.play();
						this.sound.play();
					}
					else {
						ig.music.pause();
					}
				}
			}
		}
	});
	// EntityButtonFacebook = EntityButton.extend({
	// 	size: { x: 66, y: 69 },
	// 	animSheet: new ig.AnimationSheet('media/img/button-facebook.png', 66, 69),
	// 	update: function() {
	// 		if(ig.input.pressed('click') && this.inFocus()) {
	// 			if(ig.Sound.enabled)
	// 				this.sound.play();
	// 			window.top.location.href = 'https://www.facebook.com/';
	// 		}
	// 	}
	// });
	EntityButtonEnclave = EntityButton.extend({
		size: { x: 140, y: 70 },
		animSheet: new ig.AnimationSheet('media/img/button-enclave.png', 140, 70),
		update: function() {
			if(ig.input.pressed('click') && this.inFocus()) {
				if(ig.Sound.enabled)
					this.sound.play();
				window.top.location.href = 'http://enclavegames.com';
			}
		}
	});
	EntityButtonBack = EntityButton.extend({
		size: { x: 206, y: 58 },
		animSheet: new ig.AnimationSheet('media/img/button-back.png', 206, 58),
		update: function() {
			if(ig.input.pressed('click') && this.inFocus()) {
				if(ig.Sound.enabled)
					this.sound.play();
				ig.system.setGame(StartScreen);
			}
		}
	});
	EntityButtonContinue = EntityButton.extend({
		size: { x: 146, y: 43 },
		animSheet: new ig.AnimationSheet('media/img/button-continue.png', 146, 43),
		update: function() {
		    if(ig.input.pressed('click') && this.inFocus()) {
				if(ig.Sound.enabled)
					this.sound.play();
			}
		}
	});
	EntityButtonRestart = EntityButton.extend({
		size: { x: 197, y: 58 },
		animSheet: new ig.AnimationSheet('media/img/button-restart.png', 197, 58),
		update: function() {
		    if(ig.input.pressed('click') && this.inFocus()) {
				if(ig.Sound.enabled)
					this.sound.play();
				ig.system.setGame(GameScreen);
			}
		}
	});
});