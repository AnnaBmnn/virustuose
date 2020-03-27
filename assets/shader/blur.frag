precision mediump float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;
uniform float time;
uniform float frequency;
uniform float amplitude;

vec3 colorA = vec3(0.7216, 0.2157, 0.8471);
vec3 colorB = vec3(1.0, 1.0, 1.0);

void main() {
vec2 uv = vTexCoord;

  vec3 color = vec3(0.0);

  float pct = abs(sin(frequency+ time));

  // Mix uses pct (a value from 0-1) to
  // mix the two colors
  color = mix(colorA, colorB, pct);

  vec4 f_color = vec4(color,1.0);

  f_color.g = uv.x;
  f_color.r = uv.y;
  f_color.b = uv.y + uv.x;

  //f_color.r = 0.1*(cos(uv.x) + cos(uv.y)* sin(uv.y));
  f_color.r = cos(time*0.9)*(cos(uv.x)* sin(uv.x* 5.1) + cos(uv.y* frequency *1.1));
  f_color.b = sin(time*0.3)*( cos(uv.y*0.3)* sin(uv.x*frequency));
  //f_color.r = frequency*0.01*(cos(uv.x) * sin(uv.y) + cos(uv.y)* sin(uv.x));

  gl_FragColor = f_color;
}