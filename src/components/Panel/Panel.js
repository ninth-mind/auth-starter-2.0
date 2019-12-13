import React, { useState, useEffect, useCallback } from 'react'
import Draggable from 'react-draggable'
import { Resizable } from 'react-resizable'
import { connect } from 'react-redux'
import { actions } from '~/store'
import './Panel.scss'

function Panel(props) {
  const { dispatch, defaultPosition, title, children } = props
  let [size, setSize] = useState({ width: 300, height: 500 })

  function handleResize(e, { element, size, handle }) {
    setSize({ width: size.width, height: size.height })
  }

  function handleClose(e) {
    dispatch({
      type: actions.PANEL_TOGGLE,
      state: 'close',
      title: props.title
    })
  }

  // TODO: Refactor this to be more DRY
  if (props.resizable) {
    return (
      <Draggable handle={'.panel__header'} defaultPosition={defaultPosition}>
        <Resizable
          resizeHandles={['se']}
          onResize={handleResize}
          handle={<span className="panel__resize-handle" />}
          {...size}
        >
          <div className="panel" style={{ ...size }}>
            <header className="panel__header">
              <div className="panel__header__title">{title}</div>
              <PanelHeaderSpacer />
              <div className="panel__header__controls">
                <button
                  className="panel__controls__close"
                  onClick={handleClose}
                >
                  +
                </button>
              </div>
            </header>
            <div className="panel__content">{children}</div>
            <div className="panel__footer" />
          </div>
        </Resizable>
      </Draggable>
    )
  } else {
    return (
      <Draggable handle={'.panel__header'} defaultPosition={defaultPosition}>
        <div className="panel" style={props.size}>
          <header className="panel__header">
            <div className="panel__header__title">{title}</div>
            <PanelHeaderSpacer />
            <div className="panel__header__controls">
              <button className="panel__controls__close" onClick={handleClose}>
                +
              </button>
            </div>
          </header>
          <div className="panel__content">{children}</div>
          <div className="panel__footer" />
        </div>
      </Draggable>
    )
  }
}

function PanelHeaderSpacer(props) {
  let lines = [...Array(props.numLines || 5)].map((e, i) => <li key={i} />)
  return <ul className="panel__header__spacer">{lines}</ul>
}
export default connect()(Panel)
