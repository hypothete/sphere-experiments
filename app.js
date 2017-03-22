(function (THREE) {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 10 );
  var renderer = new THREE.WebGLRenderer();
  var fovSlider = document.querySelector('#fovslider');
  var can = document.createElement('canvas');
  var ctx = can.getContext('2d');
  var cantex = new THREE.Texture(can);
  var stg = document.createElement('canvas');
  var stx = stg.getContext('2d');
  var cantex = new THREE.Texture(can);
  var ts = 0;

  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  can.width = stg.width = 4096;
  can.height = stg.height = 2048;
  document.body.appendChild( can );

  var sphereGeo = new THREE.SphereBufferGeometry(1,64,64);
  var sphereMat = new THREE.MeshBasicMaterial({side:THREE.BackSide,map:cantex});
  var sphere = new THREE.Mesh(sphereGeo, sphereMat);

  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  camera.position.z = -0.001;

  scene.add(sphere, camera);
  controls.enableDamping = true;
  controls.dampingFactor = 0.2;
  controls.enableZoom = false;
  controls.enablePan=false;
  controls.rotateSpeed = 0.1;

  fovSlider.addEventListener('input', updateFov);
  window.addEventListener('resize', resizeHandler);

  loadCanvas();
  render();

  function loadCanvas () {
    var channel0 = new Image();
    channel0.onload = function () {
      stx.drawImage(channel0,0,0,stg.width,stg.height);
    };
    channel0.src = 'image5.jpg';
  }

  function drawCanvas(){
    var wave = can.height*0.5*Math.sin(ts/800)|0;
    for (var i = -1; i < 2; i++) {
      ctx.drawImage(stg,0,wave+(i*can.height));
    }
    cantex.needsUpdate = true;
  }

  function render() {
    requestAnimationFrame(render);
    controls.update();
    drawCanvas();
    renderer.render(scene, camera);
    ts++;
  }

  function updateFov(){
    camera.fov = fovSlider.value;
    camera.updateProjectionMatrix();
  }

  function resizeHandler () {
    camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
  }

})(window.THREE);
