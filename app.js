// 创建服务器
const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const session = require('express-session')
// 设置模板引擎

app.set("view engine","ejs")

// 设置模板文件目录

app.set('views',path.join(__dirname,'views'))

// 设置node_modules为静态资源目录

app.use("/node_modules",express.static(path.join(__dirname,'node_modules')))

app.use(bodyParser.urlencoded({ extended:false }))

// 注册session处理中间件
app.use(session({
    secret:"我是一个萌萌哒秘钥",
    resave:false,
    saveUninitialized:false
}))

// 引入路由模块

// const router1=require('./router/index')
// app.use(router1)

// const router2 = require('./router/user')
// app.use(router2)

// 循环注册路由文件
// fs.readdir 读取文件目录 返回值是一个数组 数组成员是这个目录中文件的文件名
fs.readdir(path.join(__dirname,'router'),(err,filenames)=>{
    filenames.forEach(item=>{
        // item表示数组中的每一个成员
        console.log(path.join(__dirname,'router/'+item))
        app.use(require(path.join(__dirname,'router/'+item)))
    })
})

app.listen(3000,()=>{
    console.log('项目已经启动在127.0.0.1:3000');
})