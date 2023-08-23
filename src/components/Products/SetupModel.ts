//@ts-ignore Directive:
function setupModel(data) { 
    let modelArr = []
    
    for (const el of data.scene.children) {
        modelArr[el.id] = el
    } 
  
    return modelArr;
  
}

export { setupModel }