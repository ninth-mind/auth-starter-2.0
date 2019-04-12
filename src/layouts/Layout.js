import React from 'react'
import Router from 'next/router'
import Navigation from '~/components/Navigation'
import { actions } from '~/store'
import { connect } from 'react-redux'
import Loading from '~/components/Loading'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.initializeRouter = this.initializeRouter.bind(this)
  }

  componentDidMount() {
    this.initializeRouter()
  }

  initializeRouter() {
    let { dispatch } = this.props
    Router.events.on('routeChangeStart', url => {
      console.log('LOADING: ' + url)
      dispatch({
        type: actions.LOADING,
        isLoading: true
      })
    })
    Router.events.on('routeChangeComplete', () =>
      dispatch({
        type: actions.LOADING,
        isLoading: false
      })
    )
    Router.events.on('routeChangeError', e => {
      console.log('ROUTER ERROR', e)
      debugger
      dispatch({
        type: actions.LOADING,
        isLoading: false
      })
    })
  }

  render() {
    return (
      <div className="layout">
        <Navigation />
        <ToastContainer
          position={toast.POSITION.BOTTOM_RIGHT}
          autoClose={5000}
        />
        {this.props.isLoading && <Loading />}
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return { isLoading: state.ui.isLoading }
}

export default connect(mapStateToProps)(Layout)
