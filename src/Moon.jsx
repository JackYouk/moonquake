// 3D MOON MODEL WITH TEXTURES FROM https://svs.gsfc.nasa.gov/4720

import { useFrame, useLoader } from "@react-three/fiber"
import { useRef } from "react";
import { TextureLoader } from "three"


export default function Moon(props) {
    // Load texture maps from nasa images
    const [colorMap, displacementMap] = useLoader(TextureLoader, ['moon_colorMap.jpeg','moon_displacementMap.jpeg']);
    
    // Rotate moon
    const moonRef = useRef();
    useFrame((state, delta) => {
        moonRef.current.rotation.y += delta *0.1;
    });

    return(
        <>
            <mesh {...props} ref={moonRef}>
                <sphereGeometry />
                <meshStandardMaterial 
                    map={colorMap}
                    displacementMap={displacementMap}
                    displacementScale={0.1}
                />
            </mesh>
        </>
    )
}