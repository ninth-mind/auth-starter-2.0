import React from 'react'
import Panel from '../Panel'

function WordPanel(props) {
  return (
    <Panel
      key={props.index}
      title={'Word'}
      size={{ width: 100, height: 100 }}
      defaultPosition={{ x: 200, y: 1000 }}
    >
      <p>Something here</p>
    </Panel>
  )
}

export default WordPanel
