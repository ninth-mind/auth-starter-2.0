const webpack = require('webpack')
const path = require('path')
const withSass = require('@zeit/next-sass')
const withCSS = require('@zeit/next-css')
const withImages = require('next-images')

module.exports = withImages(
  withCSS(
    withSass({
      distDir: 'build',
      webpack: (config, {isServer}) => {
        config.resolve.alias = {
          ...(config.resolve.alias || {}),
          '~': path.resolve(__dirname, './src')
        }
        return config
      }
    })
  )
)
