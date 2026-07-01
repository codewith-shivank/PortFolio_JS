precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform float uProgress; // 0..1 scroll through tunnel

varying vec2 vUv;
varying vec3 vPosition;
varying float vSpeed;

void main() {
  vUv = uv;
  vPosition = position;
  vSpeed = uProgress;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
