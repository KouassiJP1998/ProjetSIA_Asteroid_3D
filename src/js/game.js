/*******************************************************
	GAME VARIABLES
*/
var camera, scene, renderer, canvasWidth, canvasHeight,
player, keys,deltaTime,
bullets, asteroids,stats,flash,

worldSize = new THREE.Vector3(((screen.width)/45)*2.54, 0, ((screen.height)/45)*2.54),

STARTING_ASTEROIDS_NUM = 2;
STARTING_FLASH_NUM = 10;

var level = 1;
var score = 0;
var eclair = 0;
var number = 2;

var GAMEOVER=false;



	// Dat.GUI Controls
	var guiControls = new function (){
	  this.rotationY = 0.01; 
	  this.rotationZ = 0.01;   
	  this.width = 1;
	  this.wireframe = false;
	}
	var datGUI = new dat.GUI();
	datGUI.add(guiControls, 'wireframe').listen();
	datGUI.add(guiControls, 'rotationY', 0, 0.3).listen();
	datGUI.add(guiControls, 'rotationZ', 0, 0.3).listen();
	datGUI.add(guiControls, 'width', 0, 3).listen();

	


/*******************************************************
	GAME INITIALISATION
*******************************************************/

// create a global audio source
var listener = new THREE.AudioListener();
var sound = new THREE.Audio( listener );

//camera.add( listener );

// load a sound and set it as the Audio object's buffer
var audioLoader = new THREE.AudioLoader();
audioLoader.load( 'src/medias/audio/scene_song.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
	sound.play();

});

function init() {

	/*************************************************************/

	const loadingManager = new THREE.LoadingManager( () => {

		const loadingScreen = document.getElementById( 'loading-screen' );
		loadingScreen.classList.add( 'fade-out' );

		// optional: remove loader from DOM via event listener
		loadingScreen.addEventListener( 'transitionend', onTransitionEnd );

	} );
	const loader = new THREE.ColladaLoader( loadingManager );
	loader.load( 'https://threejs.org/examples/models/collada/stormter.dae', ( collada ) => {

		const animations = collada.animations;
		const avatar = collada.scene;

		mixer = new THREE.AnimationMixer( avatar );
		const action = mixer.clipAction( animations[ 0 ] ).play();

		scene.add( avatar );

	} );

	/**************************************************************/
	var canvasWidth = window.innerWidth,canvasHeight = window.innerHeight;

	// Create the clock for deltaTime
	clock = new THREE.Clock();
	clock2 = new THREE.Clock(true);

	// Create the scene
	scene = new THREE.Scene();

	//scene.background = textureCube;

	// Create the camera
	camera = new THREE.PerspectiveCamera( 45, canvasWidth / canvasHeight, 1, 1000 );
	//camera.position.set(-30, 0, 0);
	camera.position.set(0,150,1);
	//camera.matrix.extractBasis(right,up,at);
	//camera.add(player);
	camera.lookAt( scene.position );
	scene.add(camera);

	// Create the renderer
	const canvas = document.querySelector('#c');
	renderer = new THREE.WebGLRenderer(
	{
    canvas: canvas,
    alpha: false
  	});
  	renderer.setSize( canvasWidth, canvasHeight );

	// create a point light
	var dirLight =
		new THREE.DirectionalLight(0xffffff);
	// set its position
	dirLight.position = new THREE.Vector3( 0, 1, 0).normalize();
	// add to the scene
	scene.add(dirLight);


	particleSystem = createParticleSystem();
    scene.add(particleSystem);
		scene.background = new THREE.TextureLoader().load("./src/medias/images/fond.jpg");


	// Add the canvas to the page
	document.body.appendChild( renderer.domElement );

	// Initialise keyboard controls
	keys = new Keys();

	// Initialise the player
	player = new Player(scene, worldSize);

	// Add borders
	createBorders(worldSize);

	// Create the bullets array
	bullets = [];

	//var newgame = new newGame(scene);
	//newgame.show();

	// Create asteroids
	asteroids = [];

	flash = [];

	createAsteroids(player);
	//createFlash(player);
	vie(scene);
	setEventHandlers();


	// Set up "hurt" flash
	$('body').append('<div id="hurt"></div>');
	$('#hurt').css( { width: canvasWidth, height: canvasHeight } );

	// Add the score HUD
	document.getElementById("hud").innerHTML = "SCORE :" + " "+score ;
	document.getElementById("hudLevel").innerHTML = "LEVEL :" + " "+level ;
	document.getElementById("flashCount").innerHTML = "ECLAIR :" + " "+eclair ;

	if (level>=3) {
		createFlash(player);
	}


	/*$('body').append('<div id="hud"><p>SCORE : <span id="score">score</span></p></div>');
	$('body').append('<div id="hudLevel"><p>LEVEL : <span id="score">level</span></p></div>');*/
	checkKeyboard();

	stats = new Stats();
	stats.domElement.style.position	= 'absolute';
	stats.domElement.style.bottom	= '0px';
	document.body.appendChild( stats.domElement );


	

}

function onTransitionEnd( event ) {
	event.target.remove();
}

function createParticleSystem() {
	// The number of particles in a particle system is not easily changed.
    var particleCount = 3000;
    // Particles are just individual vertices in a geometry
    // Create the geometry that will hold all of the vertices
    var particles = new THREE.Geometry();
	// Create the vertices and add them to the particles geometry
	for (var p = 0; p < particleCount; p++) {
		// This will create all the vertices in a range of -200 to 200 in all directions
		var x = Math.random() * 400 - 200;
		var y = Math.random() * 400 - 200;
		var z = Math.random() * 400 - 200;
		// Create the vertex
		var particle = new THREE.Vector3(x, y, z);
		// Add the vertex to the geometry
		particles.vertices.push(particle);
	}
	// Create the material that will be used to render each vertex of the geometry
	var particleMaterial = new THREE.PointsMaterial(
			{color: 0xffffff,
			 size: 4,
			 map: THREE.ImageUtils.loadTexture("src/medias/images/snowflake.png"),
			 blending: THREE.AdditiveBlending,
			 transparent: true,
			});
	// Create the particle system
	particleSystem = new THREE.Points(particles, particleMaterial);
	return particleSystem;
}










function createAsteroids(player) {
	var spread = 100,
		defaultAsteroidRadius = 8;

	for (var i = 0; i < STARTING_ASTEROIDS_NUM; i++) {

		var randPos, ar, ap, pr, pp;

		do{
			randPos =
				new THREE.Vector3(
					getRandomArbitary(-worldSize.x, worldSize.x),
					0,
					getRandomArbitary(-worldSize.z, worldSize.z));

			ar = defaultAsteroidRadius , ap = randPos,
			pr = player.boundingRadius, pp = player.model.position;
		} while(boundingCircleCollisionCheck(ar, ap, pr, pp));

		var a = new Asteroid(randPos, 2, defaultAsteroidRadius, null);

		asteroids[i] = a;
		scene.add(a.model);

	}

	/**********************************************************************************/

	/***********************************************************************************/

}
function createFlash(player) {
	var spread = 100,
		defaultFlashRadius = 2;

	for (var i = 0; i < STARTING_FLASH_NUM; i++) {

		var randPos, ar, ap, pr, pp;

		do{
			randPos =
				new THREE.Vector3(
					getRandomArbitary(-worldSize.x, worldSize.x),
					0,
					getRandomArbitary(-worldSize.z, worldSize.z));

			ar = defaultFlashRadius , ap = randPos,
			pr = player.boundingRadius, pp = player.model.position;
		} while(boundingCircleCollisionCheck(ar, ap, pr, pp));

		var a = new Flash(randPos, 2, defaultFlashRadius, null);

		flash[i] = a;
		scene.add(a.model);
	}

}



function createBorders(box) {
	var bx = box.x,
		bz = box.z;

	var material = new THREE.LineBasicMaterial(
		{
			color: 0xffffff
		});

	var geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(-bx, 0, -bz));
	geometry.vertices.push(new THREE.Vector3(bx, 0, -bz));
	geometry.vertices.push(new THREE.Vector3(bx, 0, bz));
	geometry.vertices.push(new THREE.Vector3(-bx, 0, bz));
	geometry.vertices.push(new THREE.Vector3(-bx, 0, -bz));

	var line = new THREE.Line(geometry, material);

	scene.add(line);
}

/*******************************************************
	GAME EVENT HANDLERS
*/

var setEventHandlers = function() {
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	// Window resize
	window.addEventListener("resize", onResize, false);
};

// Key down
function onKeydown(event) {
	if(player) {
		keys.onKeyDown(event);
	}
}

// Key up
function onKeyup(event) {
	if(player) {
		keys.onKeyUp(event);
	}
}

// Browser window resize
function onResize(event) {
	// Maximise the canvas
	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;

	// Update the renderer size
	renderer.setSize( canvasWidth, canvasHeight );

	// Update camera's aspect ratio
	camera.aspect = canvasWidth / canvasHeight;
	camera.updateProjectionMatrix();
}

/*******************************************************
	GAME LOOP FUNCTIONS
*/


function animateParticles() {
	var verts = particleSystem.geometry.vertices;
	for(var i = 0; i < verts.length; i++) {
		var vert = verts[i];
		if (vert.y < -200) {
			vert.y = Math.random() * 400 - 200;
		}
		vert.y = vert.y - (10 * deltaTime);
	}
	particleSystem.geometry.verticesNeedUpdate = true;

	particleSystem.rotation.y -= .1 * deltaTime;
}

function animate() {

	update( clock.getDelta() );

	animateParticles();

	draw();

	// three.js includes requestAnimationFrame shim
	requestAnimationFrame( animate );
	for (var i = asteroids.length - 1; i >= 0; i--) {
		var a = asteroids[i];
		a.model.rotation.y += guiControls.rotationY;
		a.model.rotation.z += guiControls.rotationZ;
		a.model.scale.x = guiControls.width;
		a.model.material.wireframe = guiControls.wireframe;
	}

	stats.update();
}


function update(delta) {
	deltaTime = clock2.getDelta();
	updateAsteroids(worldSize, delta);
	updateFlash(worldSize, delta);
	updateBullets(worldSize, delta);
	player.update(keys, bullets, delta);
	checkPlayerDeath(asteroids, player);
	checkPlayerBonus(flash, player);
	changeLevel();
}

function pause() {
	deltaTime = 0;
	delta = 0;
}

function draw() {
	renderer.render( scene, camera );
}

function checkPlayerDeath(asteroids, player) {
	var ai = checkAsteroidCollision(asteroids, player);
	var king;

	if (document.getElementById("invincible").style.visibility === "hidden") {
		if((ai != -1) && (pyramidVie3.visible ===true)) {
		pyramidVie3.visible =false;
		console.log("player hit!");
		player.die();

		// Explode the asteroid
		asteroids[ai].explode(scene, asteroids);
		scene.remove( asteroids[ai].model );
		asteroids.splice(ai, 1);
		}
		else if ((ai != -1) && (pyramidVie3.visible ===false) && (pyramidVie2.visible ===true)) {
			pyramidVie2.visible =false;
			console.log("player hit!");
			player.die();

			// Explode the asteroid
			asteroids[ai].explode(scene, asteroids);
			scene.remove( asteroids[ai].model );
			asteroids.splice(ai, 1);
		}
		else if ((ai != -1) && (pyramidVie3.visible ===false) && (pyramidVie2.visible ===false) && (pyramidVie1.visible ===true)) {
			gameOver(asteroids,bullets);
			document.getElementById("restartgame").style.visibility = "visible";
			kd.ENTER.press(function () {
				document.getElementById("restartgame").style.visibility = "hidden";
				score = 0;
				level = 1;
				STARTING_ASTEROIDS_NUM = 2;
			    init();
			    animate();
			});

		}
		else{

		}
	}
	else{

	}


}

function checkPlayerBonus(flash, player) {
	var ai = checkFlashCollision(flash, player);
	var king;

		if(ai != -1) {
			eclair = eclair + 1;
			scene.remove( flash[ai].model );
			flash.splice(ai, 1);
			document.getElementById("flashCount").innerHTML = "ECLAIR :" + " "+eclair;
			kd.J.press(function () {
				if (eclair>=5) {
					eclair = eclair - 5;
					document.getElementById("flashCount").innerHTML = "ECLAIR :" + " "+eclair;
					killTwo(asteroids,3);
				}
				if (eclair>=10) {
					killTwo(asteroids,3);
					eclair = eclair - 10;
					document.getElementById("flashCount").innerHTML = "ECLAIR :" + " "+eclair;
					pyramidVie3.visible=true;
					pyramidVie2.visible=true;
					pyramidVie1.visible=true;
				}
			});
		}

}



/*
	Checks for collisions of any object against all of the present astroids.
	Returns the index of the colliding asteroid and -1 if there is no collision
*/
function checkAsteroidCollision(asteroids, object) {
	for (var i = asteroids.length - 1; i >= 0; i--) {
		var a = asteroids[i],
		ar = a.boundingRadius, ap = a.model.position,
		or = object.boundingRadius, op = object.model.position;

		if( boundingCircleCollisionCheck(ar, ap, or, op) ) {
			return i;
		}
	}

	return -1;
}

function checkFlashCollision(flash, object) {
	for (var i = flash.length - 1; i >= 0; i--) {
		var a = flash[i],
		ar = a.boundingRadius, ap = a.model.position,
		or = object.boundingRadius, op = object.model.position;

		if( boundingCircleCollisionCheck(ar, ap, or, op) ) {
			return i;
		}
	}

	return -1;
}
function kill(asteroids){

		for (var i = asteroids.length - 1; i >= 0; i--) {
			var a = asteroids[i];
			scene.remove(a.model);
			asteroids.splice(i, 1);
		}

}

function killTwo(asteroids,number){
		for (var i = asteroids.length - 1; i >= number; i--) {
			var a = asteroids[i];
			a.explode(scene, asteroids);
		}

}

function gameOver(asteroids,bullets){
	GAMEOVER=true;
	camera.position.set(0, 0, 0);
	createBorders(0);
	document.getElementById("info").style.visibility = "hidden";
	for (var i = asteroids.length - 1; i >= 0; i--) {
		var a = asteroids[i];
		scene.remove(a.model);
		asteroids.splice(i,1);
	}

	for (var i = flash.length - 1; i >= 0; i--) {
		var a = flash[i];
		scene.remove(a.model);
		flash.splice(i,1);
	}

	scene.remove(player.model);
	scene.remove(pyramidVie3);
	scene.remove(pyramidVie2);
	scene.remove(pyramidVie1);

	for (var i = bullets.length - 1; i >= 0; i--) {
		var b = bullets[i];
		scene.remove(b.model);
		bullets.splice(i, 1);
	}

}

function changeLevel() {
	if ((asteroids.length) == 0 && (document.getElementById("restartgame").style.visibility == "hidden")) {

			STARTING_ASTEROIDS_NUM = STARTING_ASTEROIDS_NUM + 1;
			level = level + 1;
			document.getElementById("hudLevel").innerHTML = "LEVEL :" + " "+level;
			document.getElementById("hud").innerHTML = "SCORE :" + " "+score;


			init();
			animate();

	}
}


function updateBullets(worldSize, delta) {
	for (var i = bullets.length - 1; i >= 0; i--) {
		var b = bullets[i];

		b.update(worldSize, delta);

		ai = checkAsteroidCollision(asteroids, b);



		if(ai != -1) { // it's a hit!
			console.log("hit!");
			score = score + 1;
			document.getElementById("hud").innerHTML = "SCORE :" + " "+score ;

			scene.remove( b.model );
			bullets.splice(i, 1);

			asteroids[ai].explode(scene, asteroids);
			scene.remove( asteroids[ai].model );
			// we're only ever going to remove one asteroid, so there is no need for indices cache
			asteroids.splice(ai, 1);

		}

		if( b.isDead() ) {
			scene.remove( b.model );
			bullets.splice(i, 1);
		}
	}
}

function updateAsteroids(worldSize, delta) {
	for (var i = asteroids.length - 1; i >= 0; i--) {
		var a = asteroids[i], p = a.model.position;

		a.update(worldSize, delta);
	}
}

function updateFlash(worldSize, delta) {
	for (var i = flash.length - 1; i >= 0; i--) {
		var a = flash[i], p = a.model.position;

		a.update(worldSize, delta);
	}
}
