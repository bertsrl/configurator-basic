import { setupFont, setupModel } from './SetupModel';

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

async function loadData(path: string) {

    const gltfLoader = new GLTFLoader();
    const productData = await gltfLoader.loadAsync(path); 
    
    const product = setupModel(productData)
    console.log(product)
    return product;
}

async function loadFont(path: string) {
    
    const fontLoader = new FontLoader();
    const fontData = await fontLoader.loadAsync(path)
    console.log("My font: ", fontData.data);
    
    return fontData[0];
}
export { loadData, loadFont };