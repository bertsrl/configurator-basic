import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { setupModel } from './SetupModel';

async function loadData(path: string) {

    const gltfLoader = new GLTFLoader();
    const productData = await gltfLoader.loadAsync(path); 
    
    const product = setupModel(productData)
    console.log(product)
    return product;
}

export { loadData };