kd.tick(); // library loading

function checkKeyboard(){
  kd.F.press(function () {
    if (THREEx.FullScreen.activated()) {
        THREEx.FullScreen.cancel();
    } else {
        THREEx.FullScreen.request();
    }
  });

  kd.P.press(function () {
    // open in new window like this
    var w = window.open('', '');
    w.document.title = "Screenshot";
    //w.document.body.style.backgroundColor = "red";
    var img = new Image();
    // Without 'preserveDrawingBuffer' set to true, we must render now
    renderer.render(scene, camera);
    img.src = renderer.domElement.toDataURL();
    w.document.body.appendChild(img);

  });


  kd.H.press(function () {
    if (document.getElementById("helpgame").style.visibility === "hidden") {
            document.getElementById("helpgame").style.visibility = "visible";
    } else if (document.getElementById("helpgame").style.visibility === "visible") {
            document.getElementById("helpgame").style.visibility = "hidden";
    } else { // HACK
            // empeche erreur console
            }
  });

  kd.K.press(function () {
        kill(asteroids);
  });

  kd.I.press(function () {
    if (document.getElementById("invincible").style.visibility === "hidden") {
            document.getElementById("invincible").style.visibility = "visible";
    } else if (document.getElementById("invincible").style.visibility === "visible") {
            document.getElementById("invincible").style.visibility = "hidden";
    } else { // HACK
            // empeche erreur console
            }
  });
}
