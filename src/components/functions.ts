import * as THREE from 'three'

export function resize(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, sizes: {width: number, height: number}) {

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

export function cursor(sizes: {width: number, height: number}) {
    // Cursor
    const cursor = {
        x: 0,
        y: 0
    }

    window.addEventListener('mousemove', (event) =>
    {
        cursor.x = event.clientX / sizes.width - 0.5
        cursor.y = - (event.clientY / sizes.height - 0.5)
    })
}