(function (THREE) {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 10 );
  var renderer = new THREE.WebGLRenderer();
  var fovSlider = document.querySelector('#fovslider');
  var vertOffset = document.querySelector('#verticaloffset');
  var togglegeo = document.querySelector('#togglegeo');
  var can = document.createElement('canvas');
  var ctx = can.getContext('2d');
  var cantex = new THREE.Texture(can);
  var ts = 0;
  var vert = document.querySelector('#mapvertshader');
  var frag = document.querySelector('#mapfragshader');
  var mapName = 'timezones.jpg';

  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  can.width = 4096;
  can.height = 2048;
  cantex.wrapS = cantex.wrapT = THREE.MirroredRepeatWrapping;

  var sphereGeo = new THREE.SphereBufferGeometry(0.5,64,64);
  var planeGeo = new THREE.PlaneBufferGeometry( 2, 1, 1 );

  var shaderMat = new THREE.ShaderMaterial({
    side:THREE.BackSide,
    uniforms: {
      map: { value: cantex },
      voffset: { value: Number(vertOffset.value) }
    },
    vertexShader: vert.textContent,
    fragmentShader: frag.textContent
  });

  vertOffset.oninput = function(){
    //debugger;
    shaderMat.uniforms.voffset.value = Number(vertOffset.value);
    shaderMat.needsUpdate = true;
  };

  togglegeo.onclick = function () {
    sphere.visible = !sphere.visible;
    plane.visible = !plane.visible;
  };

  var sphere = new THREE.Mesh(sphereGeo, shaderMat);
  var plane = new THREE.Mesh(planeGeo, shaderMat);

  plane.visible = false;

  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  camera.position.z = -0.001;
  plane.position.z++;

  scene.add(sphere, plane, camera);
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
      ctx.drawImage(channel0,0,0,can.width,can.height);
      cantex.needsUpdate = true;
    };
    channel0.src = mapName;
  }

  function render() {
    requestAnimationFrame(render);
    controls.update();
    //drawCanvas();
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
