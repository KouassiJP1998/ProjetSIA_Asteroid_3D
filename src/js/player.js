function Player(scene, worldSize) {
	var rotation = 0,
	speed = 0,
	rotationSpeed = 3,
	dSpeed = 2,
	MAX_SPEED = 50,

	score = 0,

	boundingRadius = 3,

	lastShot = 0;

	var treillis = THREE.ImageUtils.loadTexture('src/medias/images/treillis.jpg', {}, function() {
    	renderer.render(scene);
	});


	// Create the cabin
	var geomCockpit = new THREE.BoxGeometry(60,50,50,1,1,1);
	var matCockpit = new THREE.MeshPhongMaterial({map: treillis});
	var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
	cockpit.castShadow = true;
	cockpit.receiveShadow = true;
	//this.mesh.add(cockpit);

	// Create the engine
	var geomEngine = new THREE.BoxGeometry(80,50,50,1,1,1);
	var matEngine = new THREE.MeshPhongMaterial({map: treillis});
	var engine = new THREE.Mesh(geomEngine, matEngine);
	engine.position.x = 40;
	engine.castShadow = true;
	engine.receiveShadow = true;

	// Create the tail
	var geomTailPlane = new THREE.BoxGeometry(15,20,5,1,1,1);
	var matTailPlane = new THREE.MeshPhongMaterial({map: treillis});
	var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
	tailPlane.position.set(-35,25,0);
	tailPlane.castShadow = true;
	tailPlane.receiveShadow = true;

	// Create the wing
	var geomSideWing = new THREE.BoxGeometry(40,8,150,1,1,1);
	var matSideWing = new THREE.MeshPhongMaterial({map: treillis});
	var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
	sideWing.castShadow = true;
	sideWing.receiveShadow = true;

	var mesh = new THREE.Group();
	mesh.add( cockpit );
	mesh.add( engine );
	mesh.add( tailPlane );
	mesh.add( sideWing );
	mesh.scale.set(.05,.05,.05);


	scene.add(mesh);
	//camera.add(mesh);

	var reset = function() {
		mesh.position.set(0, 0, 0);
		lastShot = 0;
		rotation = 0;
		speed = 0;
	};



	var update = function(keys, bullets, delta) {

		kd.TWO.press(function () {
			if (document.getElementById("continuation").style.visibility === "hidden") {
            	document.getElementById("continuation").style.visibility = "visible";
            	dSpeed = 0;
		    } else if (document.getElementById("continuation").style.visibility === "visible") {
		            document.getElementById("continuation").style.visibility = "hidden";
		            dSpeed = 12;
		    } else { // HACK
		            // empeche erreur console
		            }
  		});

		if(keys.up) {
			speed += dSpeed;
		} else if (keys.down) {
			speed -= dSpeed;
		}

		if(keys.left) {
			rotation += rotationSpeed * delta;
		} else if (keys.right) {
			rotation -= rotationSpeed * delta;
		}

		if(keys.space && Date.now() > lastShot + 700) {
			shoot(bullets);
		}

		// Always slow down
		//speed -= dSpeed * 0.35;

		// Clamp speed
		if(speed > MAX_SPEED) {
			speed = MAX_SPEED;
		} else if(speed <= 0) {
			speed = 0;
		}

		// Rotate
		mesh.rotation.y = rotation;
		//camera.rotation.y = rotation;


		// Move
		mesh.translateX(speed * delta);

		// Wrap movement in x
		if(mesh.position.x > worldSize.x) {
			mesh.position.x = -worldSize.x;
			//camera.position.z = -worldSize.z;
		} else if(mesh.position.x < -worldSize.x) {
			mesh.position.x = worldSize.x;
			//camera.position.z = worldSize.z;
		}

		// Wrap movement in z
		if(mesh.position.z > worldSize.z) {
			mesh.position.z = -worldSize.z;
			//camera.position.y = -worldSize.y;
		} else if(mesh.position.z < -worldSize.z) {
			mesh.position.z = worldSize.z;
			//camera.position.y = -worldSize.y;
		}
	};

	var die = function() {
		$('#hurt').fadeIn(75);
		reset();
		$('#hurt').fadeOut(350);
	};

	var shoot = function(bullets) {
		var bullet = new Bullet(mesh.position, mesh.rotation, scene);

		scene.add(bullet.model);
		bullets.push(bullet);
		lastShot = Date.now();
		// create a global audio source
		var listener = new THREE.AudioListener();
		var sound = new THREE.Audio( listener );

		//camera.add( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( 'src/medias/audio/sf_laser_13.mp3', function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( false );
			sound.setVolume( 0.5 );
			sound.play();
		});
	};

	return {
		boundingRadius: boundingRadius,
		model: mesh,
		update: update,
		die: die,
		reset: reset,
		draw: draw,
		shoot: shoot
	};

}
