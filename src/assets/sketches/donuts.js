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
    let scene, camera, renderer, mesh

    function setup(canvas) {
      scene = new THREE.Scene()
      // camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100)
      camera = new THREE.PerspectiveCamera(75, opts.w / opts.h, 0.1, 1000)
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true
      })

      console.log(THREE)

      let geometry = new THREE.TorusGeometry(8, 2, 16, 100)
      let material = new THREE.PointsMaterial({ color: 0x000000, size: 0.25 })
      mesh = new THREE.Points(geometry, material)

      scene.add(mesh)

      camera.position.z = 20
      renderer.setSize(opts.w, opts.h)
    }

    function animate() {
      renderer.render(scene, camera)
      // mesh.rotation.x += 0.01
      mesh.rotation.y += 0.01

      requestAnimationFrame(animate)
    }

    setup(threeMountPoint.current)
    animate()
  }, [threeMountPoint])

  return <canvas ref={threeMountPoint} />
}

export default Donuts
