precision highp float;

uniform float uTime;
uniform float uAtmosphereIntensity;
uniform vec3 uAtmosphereColor;
uniform vec3 uLightDir;

varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  // Rim lighting / atmosphere glow
  float rim = dot(normalize(vNormal), normalize(-vViewPosition));
  rim = 1.0 - abs(rim);
  rim = pow(rim, 2.5);

  // Subtle surface variation
  float surface = 0.5 + 0.5 * dot(normalize(vNormal), normalize(uLightDir));

  vec3 glow = uAtmosphereColor * rim * uAtmosphereIntensity;
  vec3 lit = uAtmosphereColor * surface * 0.3;

  gl_FragColor = vec4(glow + lit, rim * 0.85);
}
