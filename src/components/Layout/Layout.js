import React, { useRef, useEffect, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { connect } from 'react-redux'

import Navigation from '~/components/Navigation'
import Footer from '~/components/Footer'
import { Layout, Spin } from 'antd'
import { RecaptchaContext, config } from '~/store'
const { Content } = Layout
import './Layout.scss'

/**
 * THE MAIN LAYOUT
 *
 * Main layout is loaded in the root of the app. meaning this code gets executed on
 * every page. This is where router initialization happens, and other important
 * site-wide set up occurs.
 * @param {*} props
 */
function MainLayout(props) {
  const { CAPTCHA_SITE_KEY } = config
  let [captchaElement, setCaptchaElement] = useState(null)
  let recaptcha = useRef(null)

  useEffect(() => {
    if (recaptcha && recaptcha.current) setCaptchaElement(recaptcha.current)
  }, [])

  return (
    <Layout className="layout">
      <RecaptchaContext.Provider value={captchaElement}>
        <Navigation />
        <Spin spinning={props.isLoading} tip="Loading...">
          <Content>
            {props.children}
            <ReCAPTCHA
              ref={recaptcha}
              sitekey={CAPTCHA_SITE_KEY}
              size="invisible"
            />
          </Content>
          <Footer />
        </Spin>
      </RecaptchaContext.Provider>
    </Layout>
  )
}

const mapStateToProps = state => ({
  isLoading: state.ui.isLoading
})

export default connect(mapStateToProps)(MainLayout)
