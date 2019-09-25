import React from 'react'
import Panel from '../Panel'
import Donuts from '~/assets/sketches/Donuts'

function DonutPanel(props) {
  return (
    <Panel
      key={props.index}
      title={'Donut'}
      size={{ width: 300, height: 350 }}
      resizable={true}
    >
      <Donuts />
    </Panel>
  )
}

export default DonutPanel
