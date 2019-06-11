import React from 'react'
import Router from 'next/router'
import ReCAPTCHA from 'react-google-recaptcha'
import { connect } from 'react-redux'
import { setLoading } from '~/lib/utils'
import Navigation from '~/components/Navigation'
import { Layout } from 'antd'
const { Content } = Layout
import Loading from '~/components/Loading'
import { actions } from '~/store'
import './Layout.scss'

class MainLayout extends React.Component {
  constructor(props) {
    super(props)
    this.initializeRouter = this.initializeRouter.bind(this)
    this.reCaptcha // added by ref
  }

  componentDidMount() {
    this.initializeRouter()
  }

  initializeRouter() {
    let { dispatch } = this.props
    Router.events.on('routeChangeStart', url => setLoading(true, dispatch))
    Router.events.on('routeChangeComplete', url => {
      setLoading(false, dispatch)
      dispatch({
        type: actions.PAGE,
        currentPage: url
      })
    })
    Router.events.on('routeChangeError', () => setLoading(false, dispatch))
  }

  render() {
    const childrenWithProps = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        ...this.props,
        reCaptcha: this.reCaptcha
      })
    })

    return (
      <Layout className="layout">
        <Navigation />
        <Content>
          {this.props.isLoading && <Loading />}
          {childrenWithProps}
          <ReCAPTCHA
            ref={n => (this.reCaptcha = n)}
            sitekey={this.props.captchSiteKey}
            size="invisible"
          />
        </Content>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,
    localStorageName: state.constants.LOCAL_STORAGE_NAME,
    captchSiteKey: state.constants.CAPTCHA_SITE_KEY
  }
}

export default connect(mapStateToProps)(MainLayout)
