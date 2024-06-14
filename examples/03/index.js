
/**
 * 连接数据库，实现登录注册
 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');


const { MongoClient } = require("mongodb");
var dbUrl = "mongodb://localhost:27017/";
const client = new MongoClient(dbUrl);

const app = express()
const port = 3000

// 静态文件：当前目录下的public目录， 浏览器访问http://localhost:3000/会自动寻找public目录下的index.html文件，若index.html存在 会覆盖掉app.get('/') 路由的请求
app.use(express.static(path.join(__dirname, 'public')));

// 使用 body-parser 中间件
app.use(bodyParser.json()); // 解析 JSON 格式的请求体：如果请求体是 JSON 格式的， 会自动将其解析为 JavaScript 对象,并将其添加到 req.body 对象中
app.use(bodyParser.urlencoded({ extended: true })); // 解析 URL-encoded 格式的请求体

// app.get('/', (req, res) => {
//   res.send('succ')
// })

app.get('/index2', (req, res) => {
  // console.log('req', req)
  res.sendFile(path.join(__dirname, 'public', 'index2.html'))
})

app.post('/submit', (req, res) => {
  console.log('req', req)
  console.log('req.body', req.body)
  res.status(200).send(req.body)
})

// 定义login请求路由
app.post('/login', (req, res) => {
  // console.log('req', req)
  console.log('req.body', req.body)
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  let { name, pwd: password } = req.body

  const database = client.db('todo_system');
  const table = database.collection('users');
  const query = { name, password }

  table.findOne(query).then(rest => {
    console.log('rest', rest)
    if (!rest) {
      res.status(500).send({ message: `登录失败` })
      return
    }
    res.status(200).send(rest)
    // client.close();
  }).catch(error => {
    console.error(error)
    res.status(500).send('Database result processing error')
    // client.close();
  })
})

// 定义register请求路由
app.post('/register', (req, res) => {
  // console.log('req', req)
  console.log('req.body', req.body)
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  let { name, pwd: password } = req.body

  const database = client.db('todo_system');
  const table = database.collection('users');
  const query = { name, password }

  table.insertOne(query).then(rest => {
    console.log('rest', rest)
    if (!rest) {
      res.status(500).send({ message: `注册失败` })
      return
    }
    res.status(200).send(rest)
    // client.close();
  }).catch(error => {
    console.error(error)
    res.status(500).send('Database result processing error')
    // client.close();
  })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})