//这个貌似也许可能是页面转换的这个什么，也不用管


/* eslint-disable */
'use strict'
require('eventsource-polyfill')
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')

hotClient.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload()
  }
})
/****
 * 这段代码是一个前端客户端使用的热更新模块。热更新指的是在开发过程中无需手动刷新页面，当代码发生变化时，客户端会自动更新页面，从而提高开发效率。
代码的作用大致为：
引入了'use strict'，表示启用严格模式，以提高代码质量和安全性。
引入了'eventsource-polyfill'，这个模块通常用于创建EventSource对象，用于接收服务器端发送的事件流。
引入了'webpack-hot-middleware'模块，并创建了一个hotClient实例，用于与服务器建立热更新的连接。
hotClient.subscribe()方法用于订阅热更新事件，当接收到事件时，会执行回调函数。在这里，当事件的动作为'reload'时，会调用window.location.reload()方法实现页面的刷新。
代码内容含义分析：
'use strict'表示启用严格模式，增强代码的健壮性。
require('eventsource-polyfill')和require('webpack-hot-middleware/client?noInfo=true&reload=true')用于引入相应的模块。
hotClient.subscribe()用于订阅热更新事件，当事件为'reload'时，执行window.location.reload()实现页面刷新。
综合来看，这段代码的作用是在客户端建立热更新的连接，并在接收到'reload'事件时刷新页面，以实现代码的热更新效果。
 * 
 * 
 * 
*/