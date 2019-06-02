const express = require('express')
const conn = require('../db/db')
const router = express.Router()
// 测试连接是否正常


router.get('/',(req,res)=>{

    // 访问数据库 使用连接查询 展示 文章标题 作者昵称
    // `` 模板字符串
    const sql = `select blog_articles.id, 
    blog_articles.title, 
    blog_articles.ctime, 
    blog_users.nickname 
    from blog_articles LEFT JOIN blog_users 
    ON blog_articles.authorId=blog_users.id 
    ORDER BY blog_articles.id desc`
    conn.query(sql,(err,result)=>{
        if (err) {
            return res.render('index.ejs', {
              user: req.session.user,
              islogin: req.session.islogin,
              // 文章列表
              articles: []
            })
        }
        res.render('index.ejs',{ user:req.session.user,isLogin:req.session.isLogin,articles: result })
    })
    
})



module.exports = router




