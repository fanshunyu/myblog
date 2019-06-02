const express = require('express')
const path = require('path')
const router = express.Router()
const moment = require('moment')
const conn = require('../db/db')
const marked = require('marked')
// 测试连接是否正常

//  Failed to lookup view "/article/add.ejs" in views directory "C:\Users\Administrator\Desktop\myblog\views"
// 打开文章添加页
router.get('/article/add',(req,res)=>{
    if(!req.session.isLogin){
        return res.redirect('/login')
    }
    // 这里render第一个参数的相对路径是 基于配置的模板文件目录进行计算的
    // views 
    // /article/add.ejs 为什么 ./与 /不一样
    // 项目是服务端的项目 ./ 里面的. 表示的就是相对路径基于谁去计算的路径 .表示就是views目录的路径
    // /的问题是 无法获取到views目录的路径
    // 如果是写的是服务器的代码 那么使用 ./  如果是本地项目file协议的 可以随意用 ./ / 都可以
    res.render('./article/add.ejs',{ user:req.session.user,isLogin:req.session.isLogin })
})
// 打开文章详情页 /article/info/2
router.get('/article/info/:id',(req,res)=>{
    // 登录拦截
    if(!req.session.isLogin){
        return res.redirect('/login')
    }

    const id = req.params.id
    // 根据 Id 查询文章信息
    const sql = 'select * from blog_articles where id=?'
    conn.query(sql, id, (err, result) => {
      if (err) return res.send({ msg: '获取文章详情失败！', status: 500 })
      if (result.length !== 1) return res.redirect('/')
      // 在 调用 res.render 方法之前，要先把 markdown 文本，转为 html 文本
      const html = marked(result[0].content)
      // 把转换好的 HTML 文本，赋值给 content 属性
      result[0].content = html
      // 渲染详情页面
      res.render('./article/info.ejs', { user: req.session.user, isLogin: req.session.isLogin, article: result[0] })
    })
})
// 处理新增文章post
router.post('/article/add',(req,res)=>{
    const body = req.body
    // 如果在服务器端获取作者的Id，会有问题；如果文章编写了很长的时间，则 session 很可能会失效；
    // body.authorId = req.session.user.id
    body.ctime = moment().format('YYYY-MM-DD HH:mm:ss')
    // console.log(body)
    const sql = 'insert into blog_articles set ?'
    conn.query(sql, body, (err, result) => {
      if (err) return res.send({ msg: '发表文章失败！', status: 500 })
      // console.log(result)
      if (result.affectedRows !== 1) return res.send({ msg: '发表文章失败！', status: 501 })
      res.send({ msg: '发表文章成功！', status: 200, insertId: result.insertId })
    })
})
// 展示修改文章页面
router.get('/article/edit/:id',(req,res)=>{
        // 登录拦截
        if(!req.session.isLogin){
            return res.redirect('/login')
        }
    
        const id = req.params.id
        // 根据 Id 查询文章信息
        const sql = 'select * from blog_articles where id=?'
        conn.query(sql, id, (err, result) => {
          if (err) return res.send({ msg: '位置错误！', status: 500 })
          if (result.length !== 1) return res.redirect('/')
          // 渲染详情页面
          res.render('./article/edit.ejs', { user: req.session.user, isLogin: req.session.isLogin, article: result[0] })
        })
})

// 处理修改文章的post请求
router.post('/article/edit/:id',(req,res)=>{
    const body = req.body
    const sql = 'update blog_articles set ? where id=?'
    conn.query(sql,[body,req.params.id], (err, result) => {
      if (err) return res.send({ msg: '修改文章失败！', status: 500 })
      // console.log(result)
      if (result.affectedRows !== 1) return res.send({ msg: '修改文章失败！', status: 501 })
      res.send({ msg: 'success', status: 200 })
    })
})
module.exports = router

