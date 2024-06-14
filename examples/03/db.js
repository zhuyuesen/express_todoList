// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";

// MongoClient.connect(url, function (err, db) {
//   if (err) throw err;
//   console.log("数据库已创建!");
//   db.close();
// });

// const { MongoClient } = require('mongodb');
// const url = "mongodb://localhost:27017/";

// MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
//   if (err) {
//     console.error("连接到 MongoDB 失败:", err);
//     process.exit(1); // 退出进程并返回非零状态码
//   }
//   console.log("数据库已创建!");
//   client.close();
// });


const { MongoClient, ServerApiVersion } = require("mongodb");

// Replace the placeholder with your Atlas connection string
const uri = "mongodb://localhost:27017/";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("users").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
