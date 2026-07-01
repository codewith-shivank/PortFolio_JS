import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Full-screen GLSL fluid background ───────────────────────────────────────
export default function HeroBackground({ sectionIndex = 0, sectionProgress = 0 }) {
  const matRef = useRef();

  useFrame(({ clock, mouse }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    matRef.current.uniforms.uMouse.value.set(mouse.x * 0.5 + 0.5, mouse.y * 0.5 + 0.5);
    matRef.current.uniforms.uSection.value = sectionIndex;
    matRef.current.uniforms.uSectionProgress.value = sectionProgress;
  });

  // Full simplex noise fluid — inline to avoid import issues at this stage
  const fragShader = `
    precision highp float;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uSection;
    uniform float uSectionProgress;
    varying vec2 vUv;

    vec3 mod289v3(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 mod289v4(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 permute(vec4 x){return mod289v4(((x*34.0)+1.0)*x);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
    float snoise(vec3 v){
      const vec2 C=vec2(1.0/6.0,1.0/3.0);
      const vec4 D=vec4(0.0,0.5,1.0,2.0);
      vec3 i=floor(v+dot(v,C.yyy));
      vec3 x0=v-i+dot(i,C.xxx);
      vec3 g=step(x0.yzx,x0.xyz);
      vec3 l=1.0-g;
      vec3 i1=min(g.xyz,l.zxy);
      vec3 i2=max(g.xyz,l.zxy);
      vec3 x1=x0-i1+C.xxx;
      vec3 x2=x0-i2+C.yyy;
      vec3 x3=x0-D.yyy;
      i=mod289v3(i);
      vec4 p=permute(permute(permute(
        i.z+vec4(0.0,i1.z,i2.z,1.0))
        +i.y+vec4(0.0,i1.y,i2.y,1.0))
        +i.x+vec4(0.0,i1.x,i2.x,1.0));
      float n_=0.142857142857;
      vec3 ns=n_*D.wyz-D.xzx;
      vec4 j=p-49.0*floor(p*ns.z*ns.z);
      vec4 x_=floor(j*ns.z);
      vec4 y_=floor(j-7.0*x_);
      vec4 x=x_*ns.x+ns.yyyy;
      vec4 y=y_*ns.x+ns.yyyy;
      vec4 h=1.0-abs(x)-abs(y);
      vec4 b0=vec4(x.xy,y.xy);
      vec4 b1=vec4(x.zw,y.zw);
      vec4 s0=floor(b0)*2.0+1.0;
      vec4 s1=floor(b1)*2.0+1.0;
      vec4 sh=-step(h,vec4(0.0));
      vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
      vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
      vec3 p0=vec3(a0.xy,h.x);
      vec3 p1=vec3(a0.zw,h.y);
      vec3 p2=vec3(a1.xy,h.z);
      vec3 p3=vec3(a1.zw,h.w);
      vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
      vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
      m=m*m;
      return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }

    vec3 getpalette(float n) {
      // section palettes
      vec3 heroA=vec3(0.03,0.02,0.12),heroB=vec3(0.15,0.05,0.45),heroC=vec3(0.02,0.25,0.55);
      vec3 skillsA=vec3(0.02,0.08,0.12),skillsB=vec3(0.03,0.30,0.35),skillsC=vec3(0.05,0.45,0.30);
      vec3 projA=vec3(0.08,0.02,0.08),projB=vec3(0.40,0.05,0.40),projC=vec3(0.20,0.02,0.55);
      vec3 aboutA=vec3(0.08,0.05,0.02),aboutB=vec3(0.45,0.22,0.02),aboutC=vec3(0.35,0.10,0.25);
      vec3 contactA=vec3(0.02,0.05,0.12),contactB=vec3(0.05,0.20,0.50),contactC=vec3(0.15,0.40,0.65);

      float s=clamp(uSection,0.0,4.0);
      float p=clamp(uSectionProgress,0.0,1.0);
      vec3 a,b,c;
      if(s<1.0){a=mix(heroA,skillsA,p);b=mix(heroB,skillsB,p);c=mix(heroC,skillsC,p);}
      else if(s<2.0){a=mix(skillsA,projA,p);b=mix(skillsB,projB,p);c=mix(skillsC,projC,p);}
      else if(s<3.0){a=mix(projA,aboutA,p);b=mix(projB,aboutB,p);c=mix(projC,aboutC,p);}
      else{a=mix(aboutA,contactA,p);b=mix(aboutB,contactB,p);c=mix(aboutC,contactC,p);}
      float f=0.5+0.5*sin(n*3.14159);
      return a+(b-a)*f+(c-a)*(1.0-f)*0.5;
    }

    void main(){
      vec2 uv=vUv;
      vec2 mouse=uMouse;
      vec2 wuv=uv;
      wuv.x+=(mouse.x-0.5)*0.12;
      wuv.y+=(mouse.y-0.5)*0.08;
      float t=uTime*0.18;
      float n1=snoise(vec3(wuv*2.5,t));
      float n2=snoise(vec3(wuv*5.0+vec2(1.7,9.2),t*1.3));
      float n3=snoise(vec3(wuv*1.2+vec2(3.1,2.7),t*0.7));
      float n4=snoise(vec3(wuv*8.0+vec2(-2.3,5.4),t*1.8));
      float noise=n1*0.45+n2*0.25+n3*0.20+n4*0.10;
      noise=noise*0.5+0.5;
      float mouseDist=length(uv-mouse);
      float vortex=smoothstep(0.5,0.0,mouseDist);
      noise+=vortex*0.3*sin(uTime*2.0+mouseDist*15.0);
      vec3 col=getpalette(noise);
      float vignette=smoothstep(0.9,0.1,length(uv-0.5)*1.6);
      col*=vignette*1.5;
      float speck=step(0.998,snoise(vec3(uv*90.0,t*0.5)));
      col+=speck*vec3(0.5,0.65,1.0);
      gl_FragColor=vec4(col,1.0);
    }
  `;

  const vertShader = `
    varying vec2 vUv;
    void main(){vUv=uv;gl_Position=vec4(position,1.0);}
  `;

  const uniforms = useRef({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uSection: { value: 0 },
    uSectionProgress: { value: 0 },
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertShader}
        fragmentShader={fragShader}
        uniforms={uniforms.current}
        depthWrite={false}
      />
    </mesh>
  );
}
