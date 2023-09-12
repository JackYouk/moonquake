// EXAMPLE OF HOW TO USE CUSTOM MADE SHADERS AS A MATERIAL
// THIS IS NOT BEING USED IN THE WEBSITE

import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from 'three';
import { Center, Environment, OrbitControls, Text3D, shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { easing, geometry } from 'maath';
import { damp3, dampE } from "maath/easing";
import { inSphere } from "maath/random";

extend(geometry);

const PortalMaterial = shaderMaterial(
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
extend({ PortalMaterial })


/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Author: Wael Tsar (https://sketchfab.com/wael.tsar)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/butterfly-wael-tsar-97c552b03c3343e783670de61e6d179a
Title: Butterfly - Wael Tsar
*/
// Shaders by me
export function Butterfly(props) {
    const group = useRef();

    const portalMaterial1 = useRef();
    const portalMaterial2 = useRef();

    const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5));
    const [targetRotation, setTargetRotation] = useState(new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI));

    useFrame((state, delta) => {
        portalMaterial1.current.iTime += delta;
        portalMaterial2.current.iTime += delta;


        if (!group.current) return;


        // Animates position to targetPosition
        damp3(group.current.position, [targetPosition.x, targetPosition.y, targetPosition.z], 0.25, delta * .05);

        // Animates rotation to targetRotation
        //dampE(group.current.rotation, [targetRotation.x, targetRotation.y, targetRotation.z], 0.25, delta * .05);

        // If the object is close enough to its target, set a new random target
        if (group.current.position.distanceTo(targetPosition) < 0.1) {
            setTargetPosition(new THREE.Vector3(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5));
        }

        if (Math.abs(group.current.rotation.x - targetRotation.x) < 0.1 &&
            Math.abs(group.current.rotation.y - targetRotation.y) < 0.1 &&
            Math.abs(group.current.rotation.z - targetRotation.z) < 0.1) {
            setTargetRotation(new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI));
        }
    });

    const { nodes, materials, animations } = useGLTF(
        "/butterfly_-_wael_tsar.glb"
    );

    const { actions, mixer } = useAnimations(animations, group);
    const speedRef = useRef(Math.random() + 0.5); // Random speed between 0.5 and 1.5, adjust as needed


    useEffect(() => {
        mixer.timeScale = speedRef.current; // Setting the mixer's speed. Adjust if the structure differs.
        props.animate ? actions["wael tsar"].play() : actions["wael tsar"].stop();
    }, [props.animate]);

    return (
        <group ref={group} {...props} dispose={null}>
            <group name="Sketchfab_Scene">
                <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
                    <group name="Root">
                        <group
                            name="Lamp"
                            position={[4.076, 1.005, 5.904]}
                            rotation={[-0.268, 0.602, 1.931]}
                        >
                            <group name="Lamp_1" />
                        </group>
                        <group
                            name="obj1"
                            position={[-1.073, 0, -1.168]}
                            rotation={[Math.PI / 2, 0, 0]}
                        >
                            <mesh
                                name="obj1_0"
                                castShadow
                                receiveShadow
                                geometry={nodes.obj1_0.geometry}
                                material={materials.mat1}
                            >
                                {/* <portalMaterial ref={portalMaterial} uColorStart="hotpink" uColorEnd="green" /> */}
                            </mesh>
                            <group
                                name="obj2"
                                position={[-1.15, 3.763, -0.058]}
                                rotation={[-0.896, 0, 0]}
                            >
                                <mesh
                                    name="obj2_0"
                                    castShadow
                                    receiveShadow
                                    geometry={nodes.obj2_0.geometry}
                                //material={materials.mat1}
                                >
                                    <portalMaterial ref={portalMaterial1} />
                                </mesh>
                            </group>
                            <group
                                name="obj3"
                                position={[-1.15, 3.763, -0.058]}
                                rotation={[0.932, 0, 0]}
                            >
                                <mesh
                                    name="obj3_0"
                                    castShadow
                                    receiveShadow
                                    geometry={nodes.obj3_0.geometry}
                                //material={materials.mat1}
                                >
                                    <portalMaterial ref={portalMaterial2} />
                                </mesh>
                            </group>
                        </group>
                    </group>
                </group>
            </group>
        </group>
    );
}

useGLTF.preload("/butterfly_-_wael_tsar.glb");