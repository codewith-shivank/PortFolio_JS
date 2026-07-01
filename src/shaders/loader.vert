precision highp float;

attribute vec3 aPosition;
attribute float aDelay;
attribute float aTarget; // 0 or 1 (in final letter position)
attribute vec3 aFinalPos;

uniform float uProgress; // 0..1 loader progress
uniform float uTime;
uniform vec2 uResolution;

varying float vAlpha;
varying vec3 vColor;

void main() {
  float t = clamp(uProgress - aDelay * 0.8, 0.0, 1.0);
  float eased = t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;

  // Particles fly in from a sphere burst toward final letter positions
  vec3 burstOrigin = aPosition * (1.0 - eased);
  vec3 finalPos = mix(burstOrigin, aFinalPos, eased);

  // Slight oscillation while assembling
  finalPos.x += sin(uTime * 3.0 + aDelay * 10.0) * (1.0 - eased) * 0.02;
  finalPos.y += cos(uTime * 2.5 + aDelay * 7.0) * (1.0 - eased) * 0.02;

  vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Point size — larger when settled
  gl_PointSize = mix(1.5, 3.5, eased) * (300.0 / -mvPosition.z);

  vAlpha = mix(0.3, 1.0, eased);

  // Color: cyan → white when assembled
  vColor = mix(vec3(0.3, 0.6, 1.0), vec3(1.0, 1.0, 1.0), eased * eased);
}
