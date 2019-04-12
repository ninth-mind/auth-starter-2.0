import React from 'react'
import Router from 'next/router'
import Navigation from '~/components/Navigation'
import { connect } from 'react-redux'
import ls from 'store'
import Loading from '~/components/Loading'
import { ToastContainer, toast } from 'react-toastify'
import { handleToken, setLoading } from '~/lib/utils'
import 'react-toastify/dist/ReactToastify.min.css'
import './Layout.scss'

class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.initializeRouter = this.initializeRouter.bind(this)
    this.updateStoreFromToken = this.updateStoreFromToken.bind(this)
  }

  componentDidMount() {
    this.initializeRouter()
    this.updateStoreFromToken()
  }

  updateStoreFromToken() {
    const { dispatch } = this.props
    const { token } = ls.get('profile')
    handleToken(token, dispatch)
  }

  initializeRouter() {
    let { dispatch } = this.props
    Router.events.on('routeChangeStart', url => {
      setLoading(true, dispatch)
    })
    Router.events.on('routeChangeComplete', () => setLoading(false, dispatch))
    Router.events.on('routeChangeError', e => {
      console.log('ROUTER ERROR', e)
      setLoading(false, dispatch)
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
  return {
    isLoading: state.ui.isLoading,
    localStorageName: state.constants.LOCAL_STORAGE_NAME
  }
}

export default connect(mapStateToProps)(Layout)
