let song, img;
let fft;
let peakDetect;
let hand;
let osc;
let font;
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
const startButton = document.querySelector(".js-start");
const fileInput = document.querySelector(".js-file");
const testDiv = document.querySelector(".test");

startButton.addEventListener("click", function() {
  if (!song.isPlaying()) {
    startSong();
    video.play();
    video.loop();

    this.innerHTML = "pause";
  } else {
    song.pause();
    video.pause();
    this.innerHTML = "play";
  }
});

fileInput.addEventListener("change", e => {
  console.log(e);
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

  fft = new p5.FFT();
  peakDetect = new p5.PeakDetect();
}

function preload() {
  // load song

  // TODO : input type file in order to add mix directly
  song = loadSound("assets/sound/song_20200323.mp4");
  font = loadFont("assets/font/Monarch.otf");
  //hand = loadModel("assets/obj/hand.obj");

  // load the shaders, we will use the same vertex shader and frag shaders for both passes
  shader = loadShader("assets/shader/vertex.vert", "assets/shader/blur.frag");
  img = loadImage("assets/img/texture.png");
  //video = loadVideo("assets/video/video.mov");

  video = createVideo(["assets/video/video.mp4", "assets/video/video.mov"], vidLoad);
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(550, 550, WEBGL);
  graphic = createGraphics(width, height, WEBGL);
  shaderGraphic = createGraphics(width, height, WEBGL);
  cameraZ = height / 2.0 / tan((PI * 30.0) / 180.0);
}

function draw() {
  if (song.isPlaying()) {
    fft.analyze();
    peakDetect.update(fft);

    background(0);
    noStroke();

    amplitudeShader = 1;
    frequencyShader = fft.getEnergy("bass") / 50;
    setShader(1);
    plane(width);
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
}

function drawText() {
  textAlign(CENTER);
  fill("#EFFF39");
  textFont(font, 115);
  text("DANSE", -width * 0.5 + 10, -height * 0.5 + 30, width, height);
}

function drawPeakText() {
  fill("#EFFF39");
  textFont(font, 143);
  text("DANSE", -width * 0.5 + 10, 170, width, height);
}

function setShader(size) {
  // set shader to bgGraphic
  shaderGraphic.shader(shader);

  // send uniform to shader
  shader.setUniform("tex0", img);
  shader.setUniform("time", frameCount * 0.1);

  // send var to shader
  shader.setUniform("frequency", frequencyShader);
  shader.setUniform("amplitude", amplitudeShader);

  shaderGraphic.rect(0, 0, width, height);
  texture(shaderGraphic);

  //torus(height * 0.2, height * 0.1, 24, 16);
}
