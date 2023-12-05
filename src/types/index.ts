import { type Ref } from 'vue'
export type Control = {
    id: number,
    name: string,
    minSize: Ref,
    maxSize: number,
    minW: number,
    maxW: number,
    mappedValue1030?: Ref,
    mappedValue01?: number    
}

//TODO: De facut un prop pentru slider-component astfel ca 
//      daca size prop este defined atunci sa poate fi schimbat printr-un $emit