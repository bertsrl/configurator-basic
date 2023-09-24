//@ts-ignore Directive:
function setupModel(data) { 
    const modelArr = []
    
    for (const el of data.scene.children) {
        modelArr[el.id] = el
    } 
  
    return modelArr;
  
}

//@ts-ignore Directive:
function setupFont(data) { 
    const modelArr = []
    
    for (const el of data.scene.children) {
        modelArr[el.id] = el
    } 
  
    return modelArr;
  
}

export { setupModel, setupFont }