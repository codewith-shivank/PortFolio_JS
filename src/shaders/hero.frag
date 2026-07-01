precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uSection; // 0=hero,1=skills,2=projects,3=about,4=contact
uniform float uSectionProgress;

varying vec2 vUv;

// ─── Simplex Noise 3D ───────────────────────────────────────────────────────
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g  = step(x0.yzx, x0.xyz);
  vec3 l  = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// ─── Section Color Palettes ─────────────────────────────────────────────────
vec3 palette(float t) {
  // hero: deep space indigo → violet → cyan
  vec3 heroA = vec3(0.03, 0.02, 0.12);
  vec3 heroB = vec3(0.15, 0.05, 0.45);
  vec3 heroC = vec3(0.02, 0.25, 0.55);

  // skills: midnight green → teal → emerald
  vec3 skillsA = vec3(0.02, 0.08, 0.12);
  vec3 skillsB = vec3(0.03, 0.30, 0.35);
  vec3 skillsC = vec3(0.05, 0.45, 0.30);

  // projects: deep orange → magenta → electric purple
  vec3 projectsA = vec3(0.08, 0.02, 0.08);
  vec3 projectsB = vec3(0.40, 0.05, 0.40);
  vec3 projectsC = vec3(0.20, 0.02, 0.55);

  // about: golden amber → warm rose
  vec3 aboutA = vec3(0.08, 0.05, 0.02);
  vec3 aboutB = vec3(0.45, 0.22, 0.02);
  vec3 aboutC = vec3(0.35, 0.10, 0.25);

  // contact: arctic blue → ice white
  vec3 contactA = vec3(0.02, 0.05, 0.12);
  vec3 contactB = vec3(0.05, 0.20, 0.50);
  vec3 contactC = vec3(0.15, 0.40, 0.65);

  float s = clamp(uSection, 0.0, 4.0);
  float p = clamp(uSectionProgress, 0.0, 1.0);

  vec3 a, b, c;
  if (s < 1.0) {
    a = mix(heroA, skillsA, p);
    b = mix(heroB, skillsB, p);
    c = mix(heroC, skillsC, p);
  } else if (s < 2.0) {
    a = mix(skillsA, projectsA, p);
    b = mix(skillsB, projectsB, p);
    c = mix(skillsC, projectsC, p);
  } else if (s < 3.0) {
    a = mix(projectsA, aboutA, p);
    b = mix(projectsB, aboutB, p);
    c = mix(projectsC, aboutC, p);
  } else {
    a = mix(aboutA, contactA, p);
    b = mix(aboutB, contactB, p);
    c = mix(aboutC, contactC, p);
  }

  float f = 0.5 + 0.5 * sin(t * 3.14159);
  return a + (b - a) * f + (c - a) * (1.0 - f) * 0.5;
}

void main() {
  vec2 uv = vUv;
  vec2 mouse = uMouse * 0.5 + 0.5;

  // Warped UV driven by mouse position
  vec2 warpedUv = uv;
  warpedUv.x += (mouse.x - 0.5) * 0.15;
  warpedUv.y += (mouse.y - 0.5) * 0.10;

  float t = uTime * 0.18;

  // Multi-octave simplex noise for lava-lamp morphing
  float n1 = snoise(vec3(warpedUv * 2.5, t));
  float n2 = snoise(vec3(warpedUv * 5.0 + vec2(1.7, 9.2), t * 1.3));
  float n3 = snoise(vec3(warpedUv * 1.2 + vec2(3.1, 2.7), t * 0.7));
  float n4 = snoise(vec3(warpedUv * 8.0 + vec2(-2.3, 5.4), t * 1.8));

  float noise = n1 * 0.45 + n2 * 0.25 + n3 * 0.20 + n4 * 0.10;
  noise = noise * 0.5 + 0.5;

  // Mouse proximity vortex
  float mouseDist = length(uv - mouse);
  float vortex = smoothstep(0.4, 0.0, mouseDist);
  noise += vortex * 0.3 * sin(uTime * 2.0 + mouseDist * 15.0);

  vec3 col = palette(noise);

  // Vignette
  float vignette = smoothstep(0.8, 0.2, length(uv - 0.5) * 1.5);
  col *= vignette * 1.4;

  // Add subtle bright particles / specks
  float speck = step(0.998, snoise(vec3(uv * 80.0, t * 0.5)));
  col += speck * vec3(0.6, 0.7, 1.0);

  gl_FragColor = vec4(col, 1.0);
}
