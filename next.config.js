const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const withLess = require('@zeit/next-less')
const withSass = require('@zeit/next-sass')
const withCSS = require('@zeit/next-css')
const withImages = require('next-images')
const lessToJS = require('less-vars-to-js')

// Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(
    path.resolve(__dirname, './src/styles/antd-custom.less'),
    'utf8'
  )
)
// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = file => {}
}

module.exports = withImages(
  withCSS(
    withSass(
      withLess({
        lessLoaderOptions: {
          javascriptEnabled: true,
          modifyVars: themeVariables // make your antd custom effective
        },
        distDir: 'build',
        webpack: (config, { isServer }) => {
          config.resolve.alias = {
            ...(config.resolve.alias || {}),
            '~': path.resolve(__dirname, './src')
          }
          return config
        }
      })
    )
  )
)
