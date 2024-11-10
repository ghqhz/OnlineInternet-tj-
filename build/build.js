'use strict'
/***
 * 在JavaScript中，'use strict'是一种指令，用于告诉JavaScript解析器采用严格模式（strict mode）
 * 。严格模式是一种更加严格的JavaScript语法规范，可以帮助开发者避免一些常见的错误，并提高代码的安全性和性能。
使用严格模式有以下几个特点：
变量必须先声明后使用，禁止隐式声明全局变量。
禁止删除不可删除的属性。
禁止使用八进制字面量。
禁止对只读属性赋值。
使用eval时，eval内部创建的变量不能影响到外部作用域。
禁止this关键字指向全局对象。
严格模式下函数的参数名不能重复。
 * ***/
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')
const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Congratulations, the project built complete without error\n'))
    console.log(chalk.yellow(
      ' You can now check the onlinejudge in http://YouIP/'
    ))
  })
})
