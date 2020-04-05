precision mediump float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;
uniform float time;
uniform float frequency;
uniform float amplitude;


void main() {
  vec2 uv = vTexCoord;
  uv.xy = uv.yx;

  // float sineWave = -sin(uv.x * frequency + time) * amplitude;

  // vec2 distort = vec2( sineWave, 0);

  vec4 f_texture = texture2D(tex0, uv );
  f_texture.r = f_texture.b;
  f_texture.g = f_texture.b;
  f_texture.b = cos(time* 0.5);
  //f_color = f_color2 + f_color;

  // f_color.g = uv.x;
  // f_color.r = uv.y;
  //f_color.g = 0.1*cos(uv.y) +sin(uv.x) ;

  //f_color.r = 0.1*(cos(uv.x) + cos(uv.y)* sin(uv.y));
  //f_color.r = cos(time*0.9)*(cos(uv.x)* sin(uv.x* 5.1) + cos(uv.y* frequency *1.1));
  //f_color.b = sin(time*0.3)*( cos(uv.y*0.3)* sin(uv.x*frequency));
  //f_color.r = frequency*0.01*(cos(uv.x) * sin(uv.y) + cos(uv.y)* sin(uv.x));
  

  gl_FragColor = f_texture;
}