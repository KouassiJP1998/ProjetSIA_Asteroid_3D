function Flash(position, lives, startRadius, startVelocity) {
	var a=5;
	var b=20;
	var radius = getRandomArbitary(startRadius-1.0, startRadius+1.0),
		rotation =
			new THREE.Vector3(
				getRandomArbitary(-a, a),
				getRandomArbitary(-a, a),
				getRandomArbitary(-a, a)),

		velocity = startVelocity ||
			new THREE.Vector3(
				getRandomArbitary(-b, b),
				0,
				getRandomArbitary(-b, b)),

		material = new THREE.MeshBasicMaterial({color: 0xcbebf0,wireframe: true}),
		geometry = new THREE.OctahedronGeometry(radius, 1);
		geometry.dynamic = false;


		for ( var i = 0, il = geometry.vertices.length; i < il; i++ ) {
			geometry.vertices[i].x += getRandomArbitary(-radius * 0.2, radius * 0.2);
			geometry.vertices[i].y += getRandomArbitary(-radius * 0.2, radius * 0.2);
			geometry.vertices[i].z += getRandomArbitary(-radius * 0.2, radius * 0.2);
		}

		var sphere = new THREE.Mesh(geometry, material);

	sphere.position.set(position.x, 0, position.z);

	var update = function(worldSize, delta) {
		// Move
		sphere.position.x += velocity.x * delta;
		sphere.position.z += velocity.z * delta;

		// Wrap movement in x
		if(sphere.position.x > worldSize.x) {
			sphere.position.x = -worldSize.x;
		} else if(sphere.position.x < -worldSize.x) {
			sphere.position.x = worldSize.x;
		}

		// Wrap movement in z
		if(sphere.position.z > worldSize.z) {
			sphere.position.z = -worldSize.z;
		} else if(sphere.position.z < -worldSize.z) {
			sphere.position.z = worldSize.z;
		}

		// Rotate
		sphere.rotation.x += rotation.x * delta;
		sphere.rotation.y += rotation.y * delta;
	};

	var explode = function(scene, flash) {
		if(lives > 0) {
			var v1 = new THREE.Vector3(
						getRandomArbitary(-8, 8),
						0,
						getRandomArbitary(-8, 8));
			var v2 = new THREE.Vector3(
						getRandomArbitary(-8, 8),
						0,
						getRandomArbitary(-8, 8));

			var a1 = new Flash(sphere.position, lives-1, radius/2.0, v1),
				a2 = new Flash(sphere.position, lives-1, radius/2.0, v2);

			scene.add(a1.model);
			scene.add(a2.model);

			flash.push(a1);
			flash.push(a2);

			lives--;

		}
	};

	return {
		model: sphere,
		radius: radius,
		boundingRadius: radius,

		update: update,
		explode: explode
	};

}
