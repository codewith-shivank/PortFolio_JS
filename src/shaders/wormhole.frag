precision highp float;

uniform float uTime;
uniform float uProgress;
uniform vec2 uMouse;

varying vec2 vUv;
varying vec3 vPosition;

// Hash and noise utils
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),
             mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
}

void main() {
  vec2 uv = vUv;

  // Tunnel radial coordinates
  float angle = atan(uv.y - 0.5, uv.x - 0.5);
  float radius = length(uv - 0.5);

  // Speed based on progress (scroll → speed)
  float speed = 1.0 + uProgress * 8.0;
  float t = uTime * speed * 0.5;

  // Hyperspace star streaks
  float streak = 0.0;
  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    float a = angle + fi * 0.78539816;
    float r = radius + noise(vec2(cos(a) * 5.0 + fi, sin(a) * 5.0 + fi)) * 0.1;
    float streakLine = smoothstep(0.003, 0.0, abs(mod(r + t * (0.2 + fi * 0.05), 1.0) - 0.5) - 0.02 * uProgress);
    streak += streakLine * (0.5 + 0.5 * sin(fi * 1.3 + uTime));
  }

  // Tunnel vignette — bright centre, dark edges
  float edge = smoothstep(0.5, 0.1, radius);
  float center = 1.0 - smoothstep(0.0, 0.15, radius);

  // Color palette — indigo core → electric cyan → violet
  vec3 coreColor    = vec3(0.4, 0.8, 1.0);  // cyan
  vec3 midColor     = vec3(0.5, 0.2, 1.0);  // violet
  vec3 outerColor   = vec3(0.05, 0.02, 0.15);

  float colorMix = smoothstep(0.0, 0.45, radius);
  vec3 col = mix(coreColor, midColor, colorMix);
  col = mix(col, outerColor, smoothstep(0.3, 0.5, radius));

  // Apply streaks
  col += streak * vec3(0.8, 0.9, 1.0) * (0.3 + uProgress * 0.7);

  // Chromatic aberration at speed
  float abbr = uProgress * 0.02;
  col.r += noise(uv * 20.0 + vec2(abbr, 0.0)) * 0.05 * uProgress;
  col.b += noise(uv * 20.0 - vec2(abbr, 0.0)) * 0.05 * uProgress;

  // Tunnel depth glow
  col *= edge;
  col += center * vec3(0.1, 0.3, 0.5) * (0.5 + 0.5 * sin(uTime * 3.0));

  // Scanline effect
  float scanline = 0.97 + 0.03 * sin(uv.y * 800.0 + uTime * 10.0);
  col *= scanline;

  gl_FragColor = vec4(col, 1.0);
}
