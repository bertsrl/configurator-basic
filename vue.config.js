const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false,
      notify: true
    },    
  },
  transpileDependencies: [
    'quasar'
  ]
})
