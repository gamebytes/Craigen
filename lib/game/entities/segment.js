ig.module(
	'game.entities.segment'
)
.requires(
)
.defines(function(){
	MapStarter = [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[6,5,5,5,5,7,0,0,0,0,0,0,0,6,5,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[2,8,8,8,8,8,5,5,5,7,0,6,5,8,8,1,0,6,5,7,0,6,5,5,5,5,5,7,0,6,5,5,5,5,7],
	];
	MapSegments = [
		[ // level 1
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,4,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0],
			[6,8,7,0,0,4,0,0,6,1,0,0,6,5,7,0,0,0,6,7],
			[2,8,8,7,0,3,0,6,8,1,0,6,8,8,8,5,7,0,2,1]
		],
		[ // level 2
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,4,0,0,0,0,0,0,6,7,0,0,0,0,0,0,0,0],
			[6,5,5,1,0,0,6,5,7,0,2,1,0,0,0,0,0,0,0,4],
			[2,8,8,1,0,0,2,8,1,0,2,1,0,0,6,7,0,0,6,1]
		],
		[ // level 3
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,6,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,6,8,8,5,7,0,0,0,0,0,0,6,7,0,6,5,7,0],
			[0,6,8,8,8,8,8,7,0,0,6,7,0,2,1,0,2,8,1,0]
		],
		[ // level 4
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,6,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,6,7,0,2,1,0,0,0,0,0,0,4,0,0,6,5,7,0,0],
			[0,2,1,0,2,1,0,0,6,5,5,5,8,7,0,2,8,8,5,7]
		],
		[ // level 5
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[6,5,5,1,0,4,0,0,0,0,0,6,7,0,0,0,0,0,0,0],
			[8,8,8,8,5,8,5,7,0,0,6,8,1,0,0,6,5,7,0,4]
		],
		[ // level 6
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,5,7,0],
			[6,5,5,5,5,5,7,0,0,0,0,0,6,5,5,5,8,8,1,0],
			[2,8,8,8,8,8,1,0,0,6,5,5,8,8,8,8,8,8,1,0]
		],
		[ // level 7
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,6,7,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,6,5,8,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[6,5,5,8,8,8,1,0,0,0,6,5,7,6,5,7,0,0,6,7]
		],
		[ // level 8
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[6,5,7,0,0,0,0,0,0,0,0,0,0,0,6,7,0,0,0,0],
			[2,8,1,0,0,6,5,7,0,0,6,5,7,0,2,8,5,5,7,0]
		]
	];
});