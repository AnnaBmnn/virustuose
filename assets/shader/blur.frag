precision mediump float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;
uniform float time;
uniform float frequency;
uniform float amplitude;

//vec3 colorA = vec3(0.9216, 1.0, 0.4824);
vec3 colorA = vec3(1.0, 1.0, 1.0);
// vec3 colorA = vec3(0.9804, 0.3804, 0.1961);
vec3 colorB = vec3(0.3529, 0.3529, 0.3529);
// vec3 colorB = vec3(0.9882, 0.6471, 0.9725);
vec3 colorC = vec3(0.0, 0.302, 0.0902);

void main() {
  vec2 uv = vTexCoord;

  vec3 color = vec3(0.0);
  vec3 color2 = vec3(0.0);

  // float pct2 =  cos(uv.x*3.0)*cos(uv.x*3.0)+ cos(uv.y*frequency*3.0)*cos(uv.y*3.0);
  // float pct2 =  sin(uv.x ) *cos(uv.y)  +sin( uv.y) * cos(uv.x) ;
  float pct2 =  abs(cos(uv.y*frequency+time))  ;
  // float pct = uv.x + cos(frequency)*0.1 + uv.y ;
  //float pct = frequency*0.1*cos(uv.x*frequency);

  // Mix uses pct (a value from 0-1) to
  // mix the two colors
  color = mix(colorA, colorB, pct2);
  color2 = mix(colorA, colorC, pct2);

  vec4 f_color = vec4(color,1.0);
  vec4 f_color2 = vec4(color2,1.0);

  //f_color = f_color2 + f_color;

  // f_color.g = uv.x;
  // f_color.r = uv.y;
  //f_color.g = 0.1*cos(uv.y) +sin(uv.x) ;

  //f_color.r = 0.1*(cos(uv.x) + cos(uv.y)* sin(uv.y));
  //f_color.r = cos(time*0.9)*(cos(uv.x)* sin(uv.x* 5.1) + cos(uv.y* frequency *1.1));
  //f_color.b = sin(time*0.3)*( cos(uv.y*0.3)* sin(uv.x*frequency));
  //f_color.r = frequency*0.01*(cos(uv.x) * sin(uv.y) + cos(uv.y)* sin(uv.x));
  

  gl_FragColor = f_color;
}