let song, img;
let fft;
let peakDetect;
let hand;
let osc;
let font;
let fontItalic;
let frequencyShader = 10;
let amplitudeShader = 1;
let video;
let cameraZ;
let cameraX = 0;
let cameraY = 0;
let spectrum;
let isPeaking = false;
let songUpload;
let videoUpload;
let noiseScale = 0.7;
let ellipses = [];
let nbrEllipses = 2;
let peakDetected = false;
const startButton = document.querySelector(".js-start");
const fileInput = document.querySelector(".js-file");
const testDiv = document.querySelector(".test");

startButton.addEventListener("click", function () {
  if (!song.isPlaying()) {
    startSong();
    video.play();
    video.loop();
    videoW.play();
    videoW.loop();

    this.innerHTML = "pause";
  } else {
    song.pause();
    video.pause();
    videoW.pause();
    this.innerHTML = "play";
  }
});

fileInput.addEventListener("change", (e) => {
  if (e.srcElement.files.length > 0) {
    songUpload = e.srcElement.files[0];
    videoUpload = document.createElement("video");

    videoUpload.src = URL.createObjectURL(songUpload);
    song = loadSound(videoUpload.src);
  } else {
    return false;
  }
});

function startSong() {
  song.loop();
  song.setVolume(0);

  fft = new p5.FFT();
  peakDetect = new p5.PeakDetect();
}

function preload() {
  // load song

  // TODO : input type file in order to add mix directly
  song = loadSound("assets/sound/song2.mp3");
  font = loadFont("assets/font/Okomito-Regular.otf");
  fontItalic = loadFont("assets/font/Okomito-Italic.otf");
  //hand = loadModel("assets/obj/hand.obj");

  // load the shaders, we will use the same vertex shader and frag shaders for both passes
  shader = loadShader("assets/shader/vertex.vert", "assets/shader/bloom.frag");
  img = loadImage("assets/img/texture.png");
  //video = loadVideo("assets/video/video.mov");

  video = createVideo(["assets/video/video.mp4"], vidLoad);
  videoW = createVideo(["assets/video/water.mp4"], vidLoad);
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(550, 550, WEBGL);
  graphic = createGraphics(width, height, WEBGL);
  shaderGraphic = createGraphics(width, height, WEBGL);
  cameraZ = height / 2.0 / tan((PI * 30.0) / 180.0);
  setUpEllipse();
}

function draw() {
  if (song.isPlaying()) {
    fft.analyze();
    peakDetect.update(fft);

    background(0);
    noStroke();
    amplitudeShader = 1.0;

    frequencyShader = fft.getEnergy("bass") / 50;
    setShader(1);
    plane(width);
    // drawText();
  }
}

function drawSong() {
  randomSeed(99);
  rotateX(millis() / 1000);
  rotateY(millis() / 2000);
  rotateX(millis() / 2030);
  beginShape();
  vertex(20, 20, 20);

  for (var i = 0; i < spectrum.length; i++) {
    var freq = spectrum[i];
    stroke(255);
    var y = map(freq, 0, 255, 1, height, 0);
    quadraticVertex(
      random(0, width),
      random(0, height),
      random(0, 1000),
      random(0, width),
      random(0, height),
      random(0, 1000)
    );
  }

  vertex(20, 20, 20);
  endShape();
}

function windowResized() {
  //resizeCanvas(windowWidth, windowHeight);
}

function draw3d() {
  ambientLight(50);
  specularColor(255, 255, 0);
  pointLight(255, 255, 255, 0, -50, 50);
  specularColor(0, 255, 255);
  pointLight(255, 255, 0, 0, 50, 50);
  shininess(20);
  specularMaterial(255);
  rotate(millis() / 1000);
  rotateZ(millis() / 1000);
  cylinder(fft.getEnergy("bass") / 5, 100);
}

// This function is called when the video loads
function vidLoad() {
  video.pause();
  video.volume(0);
  video.hide();

  videoW.pause();
  videoW.volume(0);
  videoW.hide();
}

function drawText() {
  textAlign(LEFT);
  fill("rgba(0.6667, 0.6667, 0.6667, 0.01)");
  textFont(fontItalic, 88);
  text("J'AI JUSTE ENVIE DE DANSER TOUT LE TEMPS", -width * 0.4, -height * 0.5, width, height);
}

function setShader(size) {
  // set shader to bgGraphic
  shaderGraphic.shader(shader);

  // send uniform to shader
  shader.setUniform("tex1", videoW);
  shader.setUniform("tex0", video);
  // shader.setUniform("time", frameCount * 0.1);

  // send var to shader
  // shader.setUniform("frequency", frequencyShader);
  // shader.setUniform("amplitude", amplitudeShader);

  shaderGraphic.rect(0, 0, width, height);
  texture(shaderGraphic);

  //torus(height * 0.2, height * 0.1, 24, 16);
}

function setUpEllipse() {
  for (i = 0; i < nbrEllipses; i++) {
    let ellipse = {};
    ellipse.d = 50 + i * 20;
    ellipse.d2 = 140 + i * 10;
    ellipse.x = round(random(-width * 0.5 + 100, width * 0.5 - 100));
    ellipse.y = round(random(-height * 0.5 + 100, height * 0.5 - 100));
    ellipse.vitesse = i % 2 == 0 ? 12 : 6;
    // ellipse.vitesse = nbrEllipses - i + 3 * (nbrEllipses - i);
    console.log(ellipse.vitesse);
    // ellipse.vitesse = round(random(2, 8));
    ellipse.directionX = round(random(0, 100)) % 2 == 0 ? 1 : -1;
    ellipse.directionY = round(random(0, 100)) % 2 == 0 ? 1 : -1;
    ellipses.push(ellipse);
  }
}

function drawEllipses() {
  for (i = 0; i < nbrEllipses; i++) {
    let _ellipse = ellipses[i];
    push();
    _ellipse.x += _ellipse.vitesse * _ellipse.directionX;
    _ellipse.y += _ellipse.vitesse * _ellipse.directionY;
    if (_ellipse.x > width * 0.5 - _ellipse.d / 2 || _ellipse.x < -width * 0.5 + _ellipse.d / 2) {
      _ellipse.directionX = -_ellipse.directionX; // Changer de direction
    }
    if (
      _ellipse.y > height * 0.5 - _ellipse.d2 / 2 ||
      _ellipse.y < -height * 0.5 + _ellipse.d2 / 2
    ) {
      _ellipse.directionY = -_ellipse.directionY; // Changer de direction
    }
    rotateZ(HALF_PI);
    if (i % 2 == 1) {
      texture(video);
    }
    ellipse(_ellipse.x, _ellipse.y, _ellipse.d, _ellipse.d2, 48);
    pop();
  }
}
