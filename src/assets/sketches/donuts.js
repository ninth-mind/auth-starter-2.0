import * as THREE from 'three'
import React, { useRef, useEffect, useCallback } from 'react'

function Donuts() {
  let threeMountPoint = useRef(null)

  useEffect(() => {
    if (threeMountPoint && threeMountPoint.current) {
      memoSketch()
    }
  }, [threeMountPoint, memoSketch])

  const memoSketch = useCallback(() => {
    // globals
    let opts = {
      w: 300,
      h: 300
    }
    let scene, camera, renderer, cube, cube2, light

    function setup(canvas) {
      scene = new THREE.Scene()
      // camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100)
      camera = new THREE.PerspectiveCamera(75, opts.w / opts.h, 0.1, 1000)
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true
      })

      let geo = new THREE.BoxGeometry(1, 1, 1)
      let green = new THREE.MeshLambertMaterial({
        color: 0x00ff00,
        wireframe: true
      })
      let red = new THREE.MeshLambertMaterial({
        color: 0xff0000,
        wireframe: true
      })
      cube = new THREE.Mesh(geo, green)
      cube.position.x = 0.2
      cube2 = new THREE.Mesh(geo, red)
      cube.position.x = -0.2
      scene.add(cube)
      scene.add(cube2)

      light = new THREE.PointLight(0xffffff, 1, 20)
      light.position.z = 5

      scene.add(light)
      camera.position.z = 2

      renderer.setSize(opts.w, opts.h)
    }

    function animate() {
      renderer.render(scene, camera)
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      // cube2.rotation.x -= 0.01
      cube2.rotation.y -= 0.01

      requestAnimationFrame(animate)
    }

    setup(threeMountPoint.current)
    animate()
  }, [threeMountPoint])

  return <canvas ref={threeMountPoint} />
}

export default Donuts
