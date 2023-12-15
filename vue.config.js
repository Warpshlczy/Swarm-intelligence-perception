module.exports = {
  publicPath: './',
  lintOnSave: false,
  devServer: {
    disableHostCheck: true,
    proxy: {
      // 配置跨域
      '/api': {
        // target: 'http://101.34.16.47:8090',
        // target: 'http://101.34.16.47:6702/',
        // target: 'http://172.20.10.2:8080/',
        // target: 'http://101.34.16.47/v2/api/',
        target: 'http://101.34.16.47:3377/',
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        // 将 jsencrypt 指向 node_modules 中的 jsencrypt.js 文件
        'jsencrypt': 'jsencrypt/bin/jsencrypt.min.js'
      }
    }
  }
}