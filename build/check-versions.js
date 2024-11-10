//check version，顾名思义就是要检测版本，应该是匹配方面的内容，先搞这么多。




'use strict'
const chalk = require('chalk')
//这个chalk，默认node终端输出的是黑白汉字，所以这玩意可以改变汉字的颜色

const semver = require('semver')
/***
 * semver可以作为一个node模块，同时也可以作为一个命令行工具。功能包括：
比较两个版本号的大小
验证某个版本号是否合法
提取版本号，例如从“=v1.2.1”体取出"1.2.1"
分析版本号是否属于某个范围或符合一系列条件
等等...
看不太懂，不过应该是结构上的东西，和我关系不大，我负责显示就行了
*/
const packageConfig = require('../package.json')//遇见再说，json文件就是一个另类的字典
const shell = require('shelljs')
//ShellJS是一个Node.js模块，提供了一组用于执行Unix系统命令的简单API，使得在Node.js中执行shell命令变得更加方便和简单。
//通过ShellJS，可以在Node.js环境中执行诸如复制文件、移动文件、创建文件夹、执行命令等常见的shell操作。


function exec (cmd) {
  return require('child_process').execSync(cmd).toString().trim()
}
/****
 * 这段代码定义了一个名为exec的函数，该函数接收一个命令cmd作为参数，并返回通过执行该命令所得到的结果。
具体来说，函数内部使用Node.js内置的child_process模块中的execSync方法来执行传入的命令cmd。
execSync方法会同步地执行命令，并返回子进程的输出。然后，通过调用toString()方法将输出转换为字符串，并调用trim()方法去除字符串两端的空格和换行符。
最终，函数exec会返回执行命令后得到的结果字符串。
 * ** */



const versionRequirements = [
  {
    name: 'node',
    currentVersion: semver.clean(process.version),
    versionRequirement: packageConfig.engines.node
  }
]
/**** 这玩意是一个数组，数组之中只有一个元素，就是这个字典，这个字典里面有三个键值对。
 * 'name'键对应的值是字符串'node'，表示这个对象描述的是Node.js的版本要求。
'currentVersion'键对应的值是通过semver.clean方法清理得到的当前Node.js版本，即process.version。
'versionRequirement'键对应的值是packageConfig.engines.node，表示代码中使用的Node.js版本的要求。
 */


//数组名.push，向数组末尾添加新的元素
//在JavaScript中，shell.which('npm')通常是指使用第三方库ShellJS的which方法来查找系统中是否存在名为'npm'的可执行文件，并返回该文件的绝对路径。
//也就是说，如果有这个文件的话，那么这个版本需求里面就会多一个内容
if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'),
    versionRequirement: packageConfig.engines.npm
  })
}

module.exports = function () {
  const warnings = []
  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()
    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }
    console.log()
    process.exit(1)
  }
}
