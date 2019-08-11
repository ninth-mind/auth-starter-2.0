import React from 'react'
import Router from 'next/router'
import ReCAPTCHA from 'react-google-recaptcha'
import { connect } from 'react-redux'
import { setLoading } from '~/lib/utils'
import Navigation from '~/components/Navigation'
import { Layout, Spin } from 'antd'
const { Content } = Layout
import { actions } from '~/store'
import './Layout.scss'

class MainLayout extends React.Component {
  constructor(props) {
    super(props)
    this.initializeRouter = this.initializeRouter.bind(this)
    this.recaptcha // added by ref
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
        recaptcha: this.recaptcha
      })
    })

    return (
      <Layout className="layout">
        <Navigation />
        <Spin spinning={this.props.isLoading} tip="Loading...">
          <Content>
            {childrenWithProps}
            <ReCAPTCHA
              ref={n => (this.recaptcha = n)}
              sitekey={this.props.captchSiteKey}
              size="invisible"
            />
          </Content>
        </Spin>
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
