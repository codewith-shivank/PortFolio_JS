precision highp float;

varying float vAlpha;
varying vec3 vColor;

void main() {
  // Circular soft particle
  vec2 coord = gl_PointCoord - 0.5;
  float dist = length(coord);
  if (dist > 0.5) discard;

  float softness = 1.0 - smoothstep(0.3, 0.5, dist);
  gl_FragColor = vec4(vColor, vAlpha * softness);
}
