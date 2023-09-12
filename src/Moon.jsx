// 3D MOON MODEL WITH TEXTURES FROM https://svs.gsfc.nasa.gov/4720

import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame, useLoader } from "@react-three/fiber"
import { useRef, useState } from "react";
import { TextureLoader } from "three/src/loaders/TextureLoader"
import * as THREE from 'three'

const RippleMaterial = shaderMaterial(
    {
        iTime: 0,
        iResolution: new THREE.Color(1.0, 1.0, 1.0)
    },  // vertex shader
    /*glsl*/ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  // fragment shader
  /*glsl*/ `
uniform float iTime;
uniform vec3 iResolution;

varying vec2 vUv;

float polygonDistance(vec2 p, float radius, float angleOffset, int sideCount) {
    float a = atan(p.x, p.y) + angleOffset;
    float b = 6.28319 / float(sideCount);
    return cos(floor(.5 + a / b) * b - a) * length(p) - radius;
}

#define HASHSCALE1 443.8975
float hash11(float p) // assumes p in ~0-1 range
{
    vec3 p3  = fract(vec3(p) * HASHSCALE1);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

#define HASHSCALE3 vec3(.1031, .1030, .0973)
vec2 hash21(float p) // assumes p in larger integer range
{
    vec3 p3 = fract(vec3(p) * HASHSCALE3);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract(vec2((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y));
}

void main() {
    vec2 uv = (vUv * iResolution.xy - 0.5 * iResolution.xy) / iResolution.y;
    uv.x *= iResolution.x / iResolution.y;
    
    float accum = 0.;
    for(int i = 0; i < 83; i++) {
        float fi = float(i);
        float thisYOffset = mod(hash11(fi * 0.017) * (iTime*5. + 19.) * 0.2, 4.0) - 2.0;
        vec2 center = (hash21(fi) * 2. - 1.) * vec2(1.1, 1.0) - vec2(0.0, thisYOffset);
        float radius = 0.5;
        vec2 offset = uv - center;
        float twistFactor = (hash11(fi * 0.0347) * 2. - 1.) * 1.9;
        float rotation = 0.1 + iTime*5. * 0.2 + sin(iTime*5. * 0.1) * 0.9 + (length(offset) / radius) * twistFactor;
        accum += pow(smoothstep(radius, 0.0, polygonDistance(uv - center, 0.1 + hash11(fi * 2.3) * 0.2, rotation, 5) + 0.1), 3.0);
    }
    
    vec3 subColor = vec3(0.4, 0.8, 0.2);
    vec3 addColor = vec3(0.3, 0.2, 0.1);
    
    gl_FragColor = vec4(vec3(1.0) - accum * subColor + addColor, 1.0);
}
  `

)

// shaderMaterial creates a THREE.ShaderMaterial, and auto-creates uniform setter/getters
// extend makes it available in JSX, in this case <portalMaterial />
extend({ RippleMaterial })

function Ripple(coordinates, props) {
    const rippleMaterialRef = useRef();
    useFrame((state, delta) => {
        rippleMaterialRef.current.iTime += delta;
    });

    return (
        <mesh {...props} scale={1.08}>
            <sphereGeometry />
            <rippleMaterial ref={rippleMaterialRef} />
        </mesh>
    );
}

export default function Moon(props) {
    const [quake, setQuake] = useState(0.0);
    // Load texture maps from nasa images
    const [colorMap, displacementMap] = useLoader(TextureLoader, ['moon_colorMap.jpeg', 'moon_displacementMap.jpeg']);

    // Rotate moon
    const moonRef = useRef();
    useFrame((state, delta) => {
        moonRef.current.rotation.y += delta * 0.1;
        moonRef.current.position.x += (Math.random() - 0.5) * quake;
    });

    return (
        <>
            <group {...props}>
                <mesh ref={moonRef} onClick={() => setQuake(quake + 0.01)} onDoubleClick={() => setQuake(0.0)}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <meshStandardMaterial
                        map={colorMap}
                        displacementMap={displacementMap}
                        displacementScale={0.1}
                    />
                </mesh>
                {/* <Ripple /> */}
            </group>
        </>
    );
}