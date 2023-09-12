import { useFrame, useLoader } from "@react-three/fiber"
import { useRef } from "react";
import { TextureLoader } from "three"


export default function Moon(props) {
    const [colorMap, displacementMap] = useLoader(TextureLoader, ['moon_colorMap.jpeg','moon_displacementMap.jpeg']);
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