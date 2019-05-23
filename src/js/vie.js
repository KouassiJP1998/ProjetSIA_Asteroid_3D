var textureVie3,textureVie2,textureVie1,pyramidGeometry3,pyramidGeometry2,pyramidGeometry1,pyramidMaterial3,pyramidMaterial2,pyramidMaterial1,pyramidVie3,pyramidVie2,pyramidVie1;

function vie(scene,render,camera) {
	    textureVie3 = THREE.ImageUtils.loadTexture('src/medias/images/vieBrille.jpg', {}, function() {
    	renderer.render(scene);
		});
		textureVie2 = THREE.ImageUtils.loadTexture('src/medias/images/vieBrille.jpg', {}, function() {
    	renderer.render(scene);
		});
		textureVie1 = THREE.ImageUtils.loadTexture('src/medias/images/vieBrille.jpg', {}, function() {
    	renderer.render(scene);
		});
		pyramidGeometry3 = new THREE.CylinderGeometry(4, 2, 3, 4, false);
		pyramidGeometry2 = new THREE.CylinderGeometry(4, 2, 3, 4, false);
		pyramidGeometry1 = new THREE.CylinderGeometry(4, 2, 3, 4, false);


		pyramidMaterial3 = new THREE.MeshPhongMaterial({map: textureVie3});
		pyramidMaterial2 = new THREE.MeshPhongMaterial({map: textureVie2});
		pyramidMaterial1 = new THREE.MeshPhongMaterial({map: textureVie1});


		 pyramidVie3 = new THREE.Mesh(pyramidGeometry3, pyramidMaterial3); 
		 pyramidVie3.position.set(55, 0.0, -43);
		 pyramidVie2 = new THREE.Mesh(pyramidGeometry2, pyramidMaterial2); 
		 pyramidVie2.position.set(65, 0.0, -43);
		 pyramidVie1 = new THREE.Mesh(pyramidGeometry1, pyramidMaterial1); 
		 pyramidVie1.position.set(75, 0.0, -43);

         scene.add(pyramidVie3);
         scene.add(pyramidVie2);
         scene.add(pyramidVie1);

         return {
            pyramidVie3 : pyramidVie3,
            pyramidVie2 : pyramidVie2,
            pyramidVie1 : pyramidVie1
         };
         
}

function render() {
	requestAnimationFrame( render );
    pyramidVie2.rotation.x += 0.04;
    pyramidVie2.rotation.y += 0.04;
    pyramidVie2.rotation.z += 0.04;

    pyramidVie3.rotation.x += 0.04;
    pyramidVie3.rotation.y += 0.04;
    pyramidVie3.rotation.z += 0.04;


    pyramidVie1.rotation.x += 0.04;
    pyramidVie1.rotation.y += 0.04;
    pyramidVie1.rotation.z += 0.04;
	renderer.render( scene, camera );
}

render();