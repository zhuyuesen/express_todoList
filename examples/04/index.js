
/**
 * 连接数据库，实现登录注册
 * 添加代办到列表、删除代办
 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
var dbUrl = "mongodb://localhost:27017/todo_system";
mongoose.connect(dbUrl);

const app = express()
const port = 3000

// 静态文件：当前目录下的public目录， 浏览器访问http://localhost:3000/会自动寻找public目录下的index.html文件，若index.html存在 会覆盖掉app.get('/') 路由的请求
app.use(express.static(path.join(__dirname, 'public')));

// 使用 body-parser 中间件
app.use(bodyParser.json()); // 解析 JSON 格式的请求体：如果请求体是 JSON 格式的， 会自动将其解析为 JavaScript 对象,并将其添加到 req.body 对象中
app.use(bodyParser.urlencoded({ extended: true })); // 解析 URL-encoded 格式的请求体


app.use(cookieParser());

// session设置
app.use(session({
  name: 'todo-session', // 这里定义了自定义的 session ID cookie 名称， 不定义则默认为 connect.sid
  secret: 'your-secret-key', // 建议使用一个随机的字符串作为密钥
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,  // 在 HTTPS 上使用时设为 true， 设置为 true 时，cookie 只会在 HTTPS 连接中发送。为了开发环境的方便，通常在开发时设为 false。
    httpOnly: false, // 设置为 false 以允许 JavaScript 获取 cookie
    maxAge: 5 * 60 * 1000 // 1 分钟的有效期
  }
}));

// 定义用户模型
const User = mongoose.model('User', {
  name: String,
  password: String
}, 'users');

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

// 登录 成功则将用户信息存于session并返回cookie
app.post('/login', async (req, res) => {
  // console.log('req', req)
  console.log('req.body', req.body)
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  let { name, pwd: password } = req.body

  const user = await User.findOne({ name, password });
  console.log('user', user)
  if (user) {
    req.session.user = user; // 将用户信息存储在 session 中
    // res.send('Login successful.');
    res.status(200).send(user)
  } else {
    res.status(401).send({ message: 'Invalid username or password.' });
  }
})

app.post('/register', async (req, res) => {
  // console.log('req', req)
  // console.log('req.body', req.body)
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  let { name, pwd: password } = req.body

  if (!name || !password) {
    return res.status(500).send({ message: '请输入用户名和密码' });
  }

  const user = new User({ name, password })
  console.log('user', user)
  try {
    await user.save();
    res.status(200).send({ message: '用户注册成功' });
  } catch (error) {
    console.log('resister err', error)
    res.status(500).send({ message: '用户注册失败' });
  }

})

// 检查用户是否登录
function checkAuth(req, res, next) {
  console.log('req.session', req.session)
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).send({ message: 'Unauthorized.' });
  }
}

// 检查用户是否超时
function checkTimeout(req, res, next) {
  const currentTime = new Date().getTime();
  const lastActivityTime = req.session.lastActivity ? new Date(req.session.lastActivity).getTime() : currentTime;
  const timeout = 10 * 60 * 1000; // 10分钟
  if (currentTime - lastActivityTime > timeout) {
    req.session.destroy();
    res.status(401).send({ message: 'Session timeout. Please login again.' });
  } else {
    req.session.lastActivity = new Date();
    next();
  }
}

// 定义todo模型
const Todo = mongoose.model('Todo', {
  todaValue: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // 关联的用户
}, 'todos');

// 获取数据列表， 登录判断 和超时判断
app.get('/list', checkAuth, checkTimeout, async (req, res) => {
  let list = await Todo.find({ userId: req.session.user._id })
  console.log('list', list)
  res.status(200).send(list)
})

app.post('/add', checkAuth, async (req, res) => {
  let { todaValue } = req.body

  if (!todaValue) {
    return res.status(500).send({ message: 'todaValue is required.' });
  }

  const todo = new Todo({
    todaValue,
    userId: req.session.user._id // 使用当前用户的 ID
  });

  try {
    await todo.save();
    res.status(200).send({ message: 'Todo added successfully.' });
  } catch (error) {
    res.status(500).send({ message: 'Error adding todo.' });
  }

})

// 编辑数据项
app.post('/editItem', checkAuth, async (req, res) => {
  let { _id, todaValue } = req.body

  let filter = { _id }
  let update = { todaValue }

  try {
    let rest = await Todo.findOneAndUpdate(filter, update, { new: true });
    console.log('deleteOne rest', rest)
    res.status(200).send({ message: 'Todo deleteItem successfully.', data: rest });
  } catch (error) {
    console.log('deleteOne error', error)
    res.status(500).send({ message: 'Error deleteItem todo.' });
  }
})

// 删除数据项
app.post('/deleteItem', checkAuth, async (req, res) => {
  let { _id } = req.body

  try {
    let rest = await Todo.deleteOne({ _id });
    console.log('deleteOne rest', rest)
    res.status(200).send({ message: 'Todo deleteItem successfully.' });
  } catch (error) {
    console.log('deleteOne error', error)
    res.status(500).send({ message: 'Error deleteItem todo.' });
  }
})

// 用户退出登录
app.post('/logout', checkAuth, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send({ message: 'Error logging out.' });
    }
    res.send({ message: 'Logout successful.' });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})