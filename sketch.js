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
let nbrEllipses = 40;
let peakDetected = false;
let pg;
let colors;
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

  video = createVideo(["assets/video/video.mp4"], vidLoad);
  videoW = createVideo(["assets/video/water.mp4"], vidLoad);
}

function setup() {
  let sapin = color("#015230");
  let peach = color("#FFAF8D");
  let lavender = color("#CDCCFF");
  // let purple = color("#7000FF");
  // let darkBlue = color("#03008B");
  let yellow = color("#F2FF5B");
  let grey = color("#C1C1C1");
  // colors = [color("#FF0000"), color("#FF6B18"), color("#A7FF18"), color("#F2FF5B")];
  colors = [lavender, peach, yellow, grey];

  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight);
  pg = createGraphics(windowWidth, windowHeight);

  pg.background(grey);

  setUpEllipse();
}

function draw() {
  if (song.isPlaying()) {
    fft.analyze();
    peakDetect.update(fft);

    background(200, 200, 200);

    fill(255, 204, 0);
    pg.fill(255, 204, 0);
    pg.noStroke();
    drawFormsGraphics();
    image(pg, 0, 0);
    // filter(BLUR, 10);
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

function setUpEllipse() {
  for (i = 0; i < nbrEllipses; i++) {
    let ellipse = {};
    let _size = round(random(40, 100 - i * 10 + 405));
    ellipse.d = _size;
    ellipse.d2 = _size;
    ellipse.x = round(random(0, width));
    ellipse.y = round(random(0, height));
    ellipse.vitesse = random(0.1, 0.4);

    ellipse.directionX = round(random(0, 100)) % 2 == 0 ? 1 : -1;
    ellipse.directionY = round(random(0, 100)) % 2 == 0 ? 1 : -1;

    ellipse.color = colors[round(random(0, colors.length - 1))];
    console.log(ellipse.color);
    // console.log(round(random(0, colors.length)));
    ellipses.push(ellipse);
  }
}

function drawEllipses() {
  for (i = 0; i < nbrEllipses; i++) {
    let _ellipse = ellipses[i];
    push();
    _ellipse.x += _ellipse.vitesse * _ellipse.directionX;
    _ellipse.y += _ellipse.vitesse * _ellipse.directionY;
    if (_ellipse.x > width - _ellipse.d / 2 || _ellipse.x < _ellipse.d / 2) {
      _ellipse.directionX = -_ellipse.directionX; // Changer de direction
    }
    if (_ellipse.y > height - _ellipse.d2 / 2 || _ellipse.y < -height * 0.5 + _ellipse.d2 / 2) {
      _ellipse.directionY = -_ellipse.directionY; // Changer de direction
    }
    ellipse(_ellipse.x, _ellipse.y, _ellipse.d, _ellipse.d2, 48);
    pop();
  }
}

function drawFormsGraphics() {
  for (i = 0; i < nbrEllipses; i++) {
    let _ellipse = ellipses[i];
    push();
    _ellipse.x += _ellipse.vitesse * _ellipse.directionX;
    _ellipse.y += _ellipse.vitesse * _ellipse.directionY;
    if (_ellipse.x > width - _ellipse.d / 2 || _ellipse.x < _ellipse.d / 2) {
      _ellipse.directionX = -_ellipse.directionX; // Changer de direction
    }
    if (_ellipse.y > height - _ellipse.d2 / 2 || _ellipse.y < _ellipse.d2 / 2) {
      _ellipse.directionY = -_ellipse.directionY; // Changer de direction
    }
    // rotateZ(HALF_PI);
    pg.fill(_ellipse.color);
    pg.ellipse(_ellipse.x, _ellipse.y, _ellipse.d, _ellipse.d2, 48);
    pop();
  }
}
