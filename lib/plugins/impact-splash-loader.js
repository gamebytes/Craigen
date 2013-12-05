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
        loadingScreen.src = "data:image/png;base64,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";
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