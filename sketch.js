let song;
let fft;
let peakDetect;
let osc;
let frequencyShader = 20;
let amplitudeShader = 0.5;
const timeStartVoice = 52.8;
const timeEndVoice = 55.5;
const timeStartFlute = 72.1;
let cameraZ;
let cameraX = 0;
let cameraY = 0;
const startButton = document.querySelector(".js-start");

startButton.addEventListener("click", function() {
  if (!song.isPlaying()) {
    startSong();
    this.innerHTML = "pause";
  } else {
    song.pause();
    this.innerHTML = "play";
  }
});

function startSong() {
  song.play();

  fft = new p5.FFT();
  peakDetect = new p5.PeakDetect();

  // what to do on peak time ?
  peakDetect.onPeak(() => {
    console.log("peak");
  }, 0.9);
}

function preload() {
  // load song

  // TODO : input type file in order to add mix directly
  song = loadSound("assets/sound/song_20200320.mp4");

  // load the shaders, we will use the same vertex shader and frag shaders for both passes
  shader = loadShader("assets/shader/vertex.vert", "assets/shader/blur.frag");
  shaderTexture = loadImage("assets/img/bbq.jpg");
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  graphic = createGraphics(windowWidth, windowHeight, WEBGL);
  cameraZ = height / 2.0 / tan((PI * 30.0) / 180.0);
}

function draw() {
  if (song.isPlaying()) {
    background(0);
    camera(cameraX, cameraY, cameraZ, 0, 0, 0, 0, 0.5, 0);

    fft.analyze();
    peakDetect.update(fft);

    setShader();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setShader() {
  // set shader to bgGraphic
  graphic.shader(shader);

  // send uniform to shader
  shader.setUniform("tex0", shaderTexture);
  shader.setUniform("time", frameCount * 0.1);

  // get enery depending on time
  amplitudeShader = fft.getEnergy(600) / 600;

  // send var to shader
  shader.setUniform("frequency", frequencyShader);
  shader.setUniform("amplitude", amplitudeShader);

  graphic.rect(0, 0, width, height);
  texture(graphic);
  plane(height * 0.5);
}
