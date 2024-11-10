'use strict'
require('./check-versions')()

const config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}
/***也是个环境匹配问题
 * 接着，代码通过判断process.env.NODE_ENV是否存在来确定当前的Node.js环境是否设置了NODE_ENV环境变量。
 * 如果process.env.NODE_ENV不存在（即为假值），则执行以下操作：
通过JSON.parse(config.dev.env.NODE_ENV)将config模块中开发环境配置对象（config.dev.env.NODE_ENV）的值解析为一个JSON对象，
并将其赋值给process.env.NODE_ENV，即将开发环境的NODE_ENV配置应用到当前Node.js环境变量中。
总的来说，这段代码的作用是在Node.js应用中设置当前的环境变量NODE_ENV，
如果未手动设置NODE_ENV，则从配置文件中获取开发环境的NODE_ENV配置并应用到当前环境中。这样可以确保应用在不同环境下的正确运行。
 * 
 * 
 */





//在Node.js中，opn是一个用于在默认浏览器中打开指定URL、文件或者应用程序的库。
//通过opn库，可以方便地在Node.js应用中打开浏览器访问某个链接或者打开本地文件，而无需手动操作。
const opn = require('opn')
const path = require('path')//这个我知道，就是某个文件什么玩意的路径



/***
 * 
 * 在Node.js中，Express是一个流行的Web应用框架，用于快速构建基于Node.js的Web应用程序。
 * Express提供了一组强大的特性和工具，使开发者能够更加简单、高效地创建和管理Web应用。
Express框架的主要功能和作用包括：
路由管理：Express框架可以帮助开发者定义各种HTTP请求方法（GET、POST、PUT、DELETE等）对应的URL路径和处理程序，实现路由管理。
中间件：Express中间件系统使得在请求到达处理程序之前和之后可以执行一系列自定义的逻辑，例如请求日志记录、身份验证、错误处理等。
模板引擎支持：Express支持多种模板引擎，如EJS、Handlebars、Pug等，用于动态生成HTML页面。
静态文件服务：Express可以轻松地提供静态文件（如图片、CSS、JavaScript文件）的服务。
数据库集成：Express与各种数据库（如MongoDB、MySQL等）集成紧密，方便进行数据库操作。
路由保护：Express可以实现路由保护，确保只有被授权的用户能够访问某些路由。
总之，Express框架使得Node.js开发者能够更加高效地构建Web应用程序，简化了处理HTTP请求、路由管理、中间件处理等方面的工作，
提供了一套优雅而强大的工具和功能。因此，Express被广泛应用于Node.js Web应用程序的开发中。
 * 
 * 这玩意功能确实强大，不过看不太懂思密达
*/
const express = require('express')
//Webpack是一个现代的前端构建工具，主要用于将前端项目中的各种资源文件（如JavaScript、CSS、图片等）进行打包和处理，以便于在浏览器中进行加载和运行。
const webpack = require('webpack')


const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
const autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable

const app = express()
const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
// currently disabled until this is resolved:
// https://github.com/jantimon/html-webpack-plugin/issues/680
// compiler.plugin('compilation', function (compilation) {
//   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//     hotMiddleware.publish({ action: 'reload' })
//     cb()
//   })
// })

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
const rewrites = {
  rewrites: [{
    from: '/admin/', // 正则或者字符串
    to: '/admin/index.html', // 字符串或者函数
  }]
}
const historyMiddleware = require('connect-history-api-fallback')(rewrites);
app.use(historyMiddleware)

// serve webpack bundle output
app.use(devMiddleware)

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

const uri = 'http://localhost:' + port

var _resolve
var _reject
var readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve
  _reject = reject
})

var server
var portfinder = require('portfinder')
portfinder.basePort = port

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  portfinder.getPort((err, port) => {
    if (err) {
      _reject(err)
    }
    process.env.PORT = port
    var uri = 'http://localhost:' + port
    console.log('> Listening at ' + uri + '\n')
    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
      opn(uri)
    }
    server = app.listen(port)
    _resolve()
  })
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
