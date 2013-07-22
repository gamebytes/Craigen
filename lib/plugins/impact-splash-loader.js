ig.module(
	'plugins.impact-splash-loader'
)
.requires(
	'impact.loader'
)
.defines(function(){

ig.ImpactSplashLoader = ig.Loader.extend({
	
	endTime: 0,
	fadeToWhiteTime: 200,
	fadeToGameTime: 800,
	logoWidth: 340,
	logoHeight: 120,
	
	end: function() {
		this.parent();
		this.endTime = Date.now();
		
		// This is a bit of a hack - set this class instead of ig.game as the delegate.
		// The delegate will be set back to ig.game after the screen fade is complete.
		ig.system.setDelegate( this );
	},
	
	
	// Proxy for ig.game.run to show the screen fade after everything is loaded
	run: function() {	
		var t = Date.now() - this.endTime;
		var alpha = 1;
		if( t < this.fadeToWhiteTime ) {
			// Draw the logo -> fade to white
			this.draw();
			alpha = t.map( 0, this.fadeToWhiteTime, 0, 1);
		}
		else if( t < this.fadeToGameTime ) {
			// Draw the game -> fade from white
			ig.game.run();
			alpha = t.map( this.fadeToWhiteTime, this.fadeToGameTime, 1, 0);
		}
		else {
			// All done! Dismiss the preloader completely, set the delegate
			// to ig.game
			ig.system.setDelegate( ig.game );
			return;
		}
		
		// Draw the white rect over the whole screen
		ig.system.context.fillStyle = 'rgba(255,255,255,'+alpha+')';
		ig.system.context.fillRect( 0, 0, ig.system.realWidth, ig.system.realHeight );
	},
	
	
	draw: function() {
		// Some damping for the status bar
		this._drawStatus += (this.status - this._drawStatus)/5;
		
		var ctx = ig.system.context;
		var w = ig.system.realWidth;
		var h = ig.system.realHeight;
		var scale = w / this.logoWidth / 3; // Logo size should be 1/3 of the screen width
		var center = (w - this.logoWidth * scale)/2;
		
		// Clear
		ctx.fillStyle = 'rgba(0,0,0,0.8)';
		ctx.fillRect( 0, 0, w, h );

  		var loadingScreen = new Image();
        loadingScreen.src = "data:image/png;base64,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uVbPO4D+6jezbzeZBdhkwyPkKlhs670HGwEOa2pxyj0tKNLjrATYBnvm80iPD5VSL3DeB1cqZhO7wBbgvaZGi8QSKzUhjnME6M+Xcg53zVbFC2mRnPtFYlw2u8AjwA81VnapMmbZaLJPjxZviu0SR7qtSz5ET/gm3jlVcMR237NeLznowgL9iPdIf9DnYFuXWFWpgTQmJlbnhgAzSxEdCEuVmDFs8rSm3TnErgD+3wl8/dRA52u9M6gb91GT9Ttuz4Z34/U81Y1Yb68w+sLXgW2SwJdrzzY/RQ8zwO9o/aws6wzXLn9EevkVpP41Z2+He/urNjUXXIbwdqVKBp/w00mA33V8ddldL8+TXD929MkPjJTrmaj143OciUE5SyfrPURcOTuN7qBbkl8QvYzi5vK+aN1B2F75xDDt7TMO/StbAP7yAAaYACaACWACmAAmgAEmgAlgApgAJoAJYIAJYAKYACaACWACmAAGmAAmgAlgApgAJoABJoAJYAKYACaACWCACWACmAAmgAlgApgABpgAJoAJYAKYACaAASaACWACmAAmgAlggNkEABPABDABTAATwAQwwAQwAUwAE8AEMAEMMAFMABPABDABTAATwAATwAQwAUwAE8AEMMAEMAFMABPABDABDDABTAATwAQwAUwAE8AAE8AEMAFMABPABDDABDABTAATwPSK/gE8SVXnUwEtuwAAAABJRU5ErkJggg==";
        ctx.drawImage(loadingScreen, 0, 0);
		// URL
		// ctx.fillStyle = 'rgb(128,128,128)';
		// ctx.textAlign = 'right';
		// ctx.font = '10px Arial';
		// ctx.fillText( 'http://impactjs.com', w - 10, h - 10 );
		// ctx.textAlign = 'left';
		
		
		ctx.save();
		
			ctx.translate( center, h / 1.9 );
			ctx.scale( scale, scale );
			
			// Loading bar ('visually' centered for the Impact logo)
			ctx.lineWidth = '3';
			ctx.strokeStyle = 'rgb(255,255,255)';
			ctx.strokeRect( 25, this.logoHeight + 40, 300, 20 );
			
			ctx.fillStyle = 'rgb(255,255,255)';
			ctx.fillRect( 30, this.logoHeight + 45, 290 * this._drawStatus, 10 );		
			
			// // Draw 'Impact' text
			// this.drawPaths( 'rgb(255,255,255)', ig.ImpactSplashLoader.PATHS_IMPACT );
			
			// // Some quick and dirty hackery to make the comet's tail wiggle
			// var comet = ig.ImpactSplashLoader.PATHS_COMET;
			// comet[5][0] = 3 -Math.random() * this._drawStatus * 7;
			// comet[5][1] = 3 -Math.random() * this._drawStatus * 10;
			// comet[7][0] = 29.5 -Math.random() * this._drawStatus * 10;
			// comet[7][1] = 40.4 -Math.random() * this._drawStatus * 10;
			// comet[9][0] = 16.1 -Math.random() * this._drawStatus * 10;
			// comet[9][1] = 36.1 -Math.random() * this._drawStatus * 5;
			// ctx.translate( -Math.random() * this._drawStatus * 7, -Math.random() * this._drawStatus * 5 );
			
			// // Draw the comet
			// this.drawPaths( 'rgb(243,120,31)', comet );
			
		ctx.restore();	
	},
	
	
	drawPaths: function( color, paths ) {
		var ctx = ig.system.context;
		ctx.fillStyle = color;
		
		for( var i = 0; i < paths.length; i+=2 ) {
			ctx[ig.ImpactSplashLoader.OPS[paths[i]]].apply( ctx, paths[i+1] );
		}
	}
});

ig.ImpactSplashLoader.OPS = {
	bp:'beginPath',
	cp:'closePath',
	f:'fill',
	m:'moveTo',
	l:'lineTo',
	bc:'bezierCurveTo'
};

// ig.ImpactSplashLoader.PATHS_COMET = [
// 	'bp',[],'m',[85.1,58.3],'l',[0.0,0.0],'l',[29.5,40.4],'l',[16.1,36.1],'l',[54.6,91.6],'bc',[65.2,106.1,83.4,106.7,93.8,95.7],'bc',[103.9,84.9,98.6,67.6,85.1,58.3],'cp',[],'m',[76.0,94.3],'bc',[68.5,94.3,62.5,88.2,62.5,80.8],'bc',[62.5,73.3,68.5,67.2,76.0,67.2],'bc',[83.5,67.2,89.6,73.3,89.6,80.8],'bc',[89.6,88.2,83.5,94.3,76.0,94.3],'cp',[],'f',[]
// ];

// ig.ImpactSplashLoader.PATHS_IMPACT = [
// 	'bp',[],'m',[128.8,98.7],'l',[114.3,98.7],'l',[114.3,26.3],'l',[128.8,26.3],'l',[128.8,98.7],'cp',[],'f',[],
// 	'bp',[],'m',[159.2,70.1],'l',[163.6,26.3],'l',[184.6,26.3],'l',[184.6,98.7],'l',[170.3,98.7],'l',[170.3,51.2],'l',[164.8,98.7],'l',[151.2,98.7],'l',[145.7,50.7],'l',[145.7,98.7],'l',[134.1,98.7],'l',[134.1,26.3],'l',[155.0,26.3],'l',[159.2,70.1],'cp',[],'f',[],
// 	'bp',[],'m',[204.3,98.7],'l',[189.8,98.7],'l',[189.8,26.3],'l',[211.0,26.3],'bc',[220.0,26.3,224.5,30.7,224.5,39.7],'l',[224.5,60.1],'bc',[224.5,69.1,220.0,73.6,211.0,73.6],'l',[204.3,73.6],'l',[204.3,98.7],'cp',[],'m',[207.4,38.7],'l',[204.3,38.7],'l',[204.3,61.2],'l',[207.4,61.2],'bc',[209.1,61.2,210.0,60.3,210.0,58.6],'l',[210.0,41.3],'bc',[210.0,39.5,209.1,38.7,207.4,38.7],'cp',[],'f',[],
// 	'bp',[],'m',[262.7,98.7],'l',[248.3,98.7],'l',[247.1,88.2],'l',[238.0,88.2],'l',[237.0,98.7],'l',[223.8,98.7],'l',[233.4,26.3],'l',[253.1,26.3],'l',[262.7,98.7],'cp',[],'m',[239.4,75.5],'l',[245.9,75.5],'l',[242.6,43.9],'l',[239.4,75.5],'cp',[],'f',[],
// 	'bp',[],'m',[300.9,66.7],'l',[300.9,85.9],'bc',[300.9,94.9,296.4,99.4,287.4,99.4],'l',[278.5,99.4],'bc',[269.5,99.4,265.1,94.9,265.1,85.9],'l',[265.1,39.1],'bc',[265.1,30.1,269.5,25.6,278.5,25.6],'l',[287.2,25.6],'bc',[296.2,25.6,300.7,30.1,300.7,39.1],'l',[300.7,56.1],'l',[286.4,56.1],'l',[286.4,40.7],'bc',[286.4,38.9,285.6,38.1,283.8,38.1],'l',[282.1,38.1],'bc',[280.4,38.1,279.5,38.9,279.5,40.7],'l',[279.5,84.3],'bc',[279.5,86.1,280.4,86.9,282.1,86.9],'l',[284.0,86.9],'bc',[285.8,86.9,286.6,86.1,286.6,84.3],'l',[286.6,66.7],'l',[300.9,66.7],'cp',[],'f',[],
// 	'bp',[],'m',[312.5,98.7],'l',[312.5,39.2],'l',[303.7,39.2],'l',[303.7,26.3],'l',[335.8,26.3],'l',[335.8,39.2],'l',[327.0,39.2],'l',[327.0,98.7],'l',[312.5,98.7],'cp',[],'f',[]
// ];


});