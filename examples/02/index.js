
/**
 * 基础路由、静态文件访问
 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express()
const port = 3000

// 配置express静态文件服务
// app.use(): 这是 Express.js 中的一个中间件函数, 用于将一个中间件函数添加到应用程序的请求处理流程中。
// express.static(path.join(__dirname, 'public'))
// express.static() 是 Express.js 提供的一个内置中间件函数, 用于提供静态文件服务。
// path.join(__dirname, 'public') 是用来构建静态文件目录的路径。__dirname 是 Node.js 中的一个特殊变量, 它表示当前脚本所在的目录。'public' 则是静态文件所在的目录名称。
// 这样配置之后, Express.js 应用程序就可以在 http://localhost:3000/ 这样的路径下访问 public 目录中的静态文件了,比如 CSS、JavaScript、图片等。
// 静态文件：当前目录下的public目录， 浏览器访问http://localhost:3000/会自动寻找public目录下的index.html文件，若index.html存在 会覆盖掉app.get('/') 路由的请求
app.use(express.static(path.join(__dirname, 'public')));

// 使用 body-parser 中间件
app.use(bodyParser.json()); // 解析 JSON 格式的请求体：如果请求体是 JSON 格式的， 会自动将其解析为 JavaScript 对象,并将其添加到 req.body 对象中
app.use(bodyParser.urlencoded({ extended: true })); // 解析 URL-encoded 格式的请求体

// get('/')请求会默认寻找静态目录下的index.html文件
// app.get('/', (req, res) => {
//   res.send('succ')
// })

// 访问 index2.html文件
app.get('/index2', (req, res) => {
  // 返回public下的index2.html文件
  res.sendFile(path.join(__dirname, 'public', 'index2.html'))
})

// 定义post请求 接收页面请求并解析参数
app.post('/submit', (req, res) => {
  console.log('req.body', req.body)
  // 定义http状态为200， 发送接收到的请求参数
  res.status(200).send(req.body)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})