/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

function Donuts(props) {
  let threeMountPoint = useRef(null)

  useEffect(() => {
    if (threeMountPoint && threeMountPoint.current) {
      setup(threeMountPoint.current)
      animate()
    }
  }, [threeMountPoint])

  // globals
  let opts = {
    w: 600,
    h: 600
  }
  let scene, camera, renderer, geometry, material, cube

  function setup(canvas) {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, opts.w / opts.h, 0.1, 1000)

    renderer = new THREE.WebGLRenderer({
      canvas: canvas
    })
    renderer.setSize(opts.w, opts.h)

    geometry = new THREE.BoxGeometry(1, 1, 1)
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    camera.position.z = 5
  }

  function animate() {
    requestAnimationFrame(animate)

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    renderer.render(scene, camera)
  }

  return (
    <canvas
      className="three-wrapper"
      ref={threeMountPoint}
      style={{ width: opts.w, height: opts.h }}
    />
  )
}

export default Donuts
