/**
 * 启动一个服务
 * 启动成功后使用浏览器访问 http://localhost:3000/， 看到 Hello World!即说明成功
 */

const express = require('express');
const app = express() // 创建一个 Express.js 应用程序实例
const port = 3000 // 默认端口

// 定义一个基础路由
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// 监听端口，控制台打印服务已启动
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})