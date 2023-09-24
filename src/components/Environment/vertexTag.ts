import * as THREE from "three";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

THREE.Cache.enabled = true;

function provideVertexTag(index?: number) {
    const group = new THREE.Group()
    
    const loader = new FontLoader();
    // Loading the JSON font file from CDN. Can be a file path too.
    const font = loader.load('https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_regular.typeface.json', (font) => {

        console.log("Your fucking font:", font)
        
        const radius = 2; // Adjust the radius as needed
        const segments = 32; // Number of segments for the circle
    
        const circleGeometry = new THREE.CircleGeometry(radius, segments);
        const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
        const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
    
        circleMesh.scale.set(0.25, 0.25, 0.25)
        
        group.add(circleMesh)
        
        // Create the text geometry
        const textGeometry = new TextGeometry('V'+index?.toString(), {
            font: font,
            size: 18,
            height: 5,
            curveSegments: 32,
            bevelEnabled: true,
            bevelThickness: 0.5,
            bevelSize: 0.5,
            bevelSegments: 8,
        });

        // Create a standard material with red color and 50% gloss
        const material = new THREE.MeshStandardMaterial({
        color: 'black',
        roughness: 0.5,
        });

        // Geometries are attached to meshes so that they get rendered
        const textMesh = new THREE.Mesh(textGeometry, material);
        // Update positioning of the text
        textMesh.position.set(circleMesh.position.x-0.08, circleMesh.position.y-0.10, circleMesh.position.z)
        textMesh.scale.set(.01,.01,.01)

        group.add(textMesh)
        
    });   
    
    return group
}

export default provideVertexTag;