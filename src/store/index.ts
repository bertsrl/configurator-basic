import { reactive, ref, watch, toRaw } from 'vue'
import { doc, getDocs, getDoc, where, query, collection, type DocumentData, updateDoc } from 'firebase/firestore'
import * as THREE from 'three'

import anime from 'animejs/lib/anime.es.js'

import { defineStore } from 'pinia'
import {type Control } from "@/types"

export const dbRef = ref()
export const dbDocs = ref(<DocumentData>[])

export const isLoading = ref(false)
export const isDraggable = ref(true)
export const isCameraswitchSelected = ref(false)
export const isMetricsEnabled = ref(true)
export const isProfileLook = ref(false)
export const isSphereLook = ref(false)
export const isWindowLook = ref(false)
export const windowChange = ref(false)
export const helpersControls = ref(true)

export const cameraFrontPosition = new THREE.Object3D

export const productRefMorphMeshes = ref([])

export const meters = reactive({
  x: ref(),
  y: ref()
})

export const windowRef = ref()
export const activeTexture = ref()

const isMainPanel = ref(true)
export  function switchToMainPanel() {
  if (isMainPanel.value) {
    anime({
      targets: '.main-panel',
      translateX: [0, 800],
      easing: 'easeInOutQuad'
    })

    anime({
      targets: '.configure-panel',
      translateX: [0, -900],
      delay: anime.stagger(100),
      easing: 'easeInOutQuad'
    })

    isMainPanel.value = false
  } else {
    anime({
      targets: '.configure-panel',
      translateX: [-900, 0],
      easing: 'easeInOutQuad'
    })

    anime({
      targets: '.main-panel',
      translateX: [800, 0],
      delay: anime.stagger(100),
      easing: 'easeInOutQuad'
    })

    isMainPanel.value = true
    configurePanelOpen.value = false
  }
}

export const textMeshes = reactive({
   windowWidthText: ref(),
   windowHeightText: ref()
})

export const units = reactive({
   width: ref(0),
   height: ref(0)
})

export const profileRef = ref()

export function resetValues() {
  meters.x = 0
  meters.y = 0
  
  units.width = 0
  units.height = 0
} 

export const mappedValues = reactive({
  width: ref(0),
  height: ref(0)
})

export const showCard1 = ref(true)
export const showCard2 = ref(false)

export const loggerText = ref('')

export function toggleCards() {
  showCard1.value = !showCard1.value
  showCard2.value = !showCard2.value
  console.log(showCard1.value, showCard2.value)
}

export const controlsArray = reactive(<Control[]>[
  { id: 0, name: 'Width', minSize: ref(0), maxSize: ref(30), minW: ref(0), maxW: ref(20), displayed: ref(0), mappedValue1030: ref(0), mappedValue01: 0 }, 
  { id: 1, name: 'Height', minSize: ref(0), maxSize: ref(30), minW: ref(0), maxW: ref(100), displayed:ref(0), mappedValue1030: ref(0), mappedValue01: 0 }
])

export async function getControlsFromDB() {
  const docRef = collection(dbRef.value, 'Controls')
  const docSnap = await getDocs(docRef)

  docSnap.forEach(async (doc) => {
    // Assuming 'name' is a field in your document
    const dbDocName = doc.data().name;

    // Find the object in newArray that matches the document's name
    const updatedObject = controlsArray.find(obj => obj.name === dbDocName);

    if (updatedObject) {
      console.log(doc.data().name, " ",   doc.data().minSize)
      controlsArray[updatedObject.id].minSize = doc.data().minSize
      controlsArray[updatedObject.id].maxSize = doc.data().maxSize
      controlsArray[updatedObject.id].minW = doc.data().minW
      controlsArray[updatedObject.id].maxW = doc.data().maxW 
      controlsArray[updatedObject.id].displayed = doc.data().displayed
    }
  })
}

export const sizeInputsErrors = ref(0)

export const configurePanelOpen = ref(false)
export const productLoaded = ref(false)
export const isSliderMounted = ref()
export const currentConfigPanelId = ref(0)


import { getFirestore } from 'firebase/firestore/lite'

export async function updateControlsFromDB(name: string, data: any) {
  console.log("dbRef.value", dbRef.value)
  const docRef = collection(dbRef.value, 'Controls')

  const q = query(docRef, where("name", "==", name));

    const querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
        updateDoc(doc.ref, data) 
    })

}

watch(controlsArray[0], (newVal) => {
  if (newVal.maxSize) {
    console.log(newVal)
  }
})



export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    double: state => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
