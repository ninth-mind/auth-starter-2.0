import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'

/**
 *
 * @param {*} props
 */
function PanelManager(props) {
  let { panels } = props
  let [panelModuleList, setPanelList] = useState([])

  const getModules = useCallback(async () => {
    console.log('running get modules')
    if (panels.length > 0) {
      let promises = []
      panels.forEach(pname => {
        let prom = import(`./Panels/${pname}-panel`)
        promises.push(prom)
      })
      Promise.all(promises).then(modules => {
        console.log('VALUES', modules)
        let comps = modules.map((m, i) => m.default({ index: i }))
        console.log(comps)
        setPanelList(comps)
      })
    } else {
      setPanelList([])
    }
  }, [panels])

  useEffect(() => {
    getModules()
  }, [getModules, panels])

  return <div>{panelModuleList}</div>
}

const mapStateToProps = state => ({
  panels: state.ui.panels
})

export default connect(mapStateToProps)(PanelManager)
