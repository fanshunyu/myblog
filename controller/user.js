const conn = require('../db/db')
const bcrypt = require('bcrypt')
const moment = require('moment')
const saltRounds = 10
module.exports = {
    showLoginPage: (req, res) => {
        res.render('./user/login.ejs', {})
    },
    showRegisterPage: (req, res) => {
        res.render('./user/register.ejs', {})
    },
    register: (req, res) => {
        // 获取post提交的表单参数
        // req.body
        const body = req.body
        // 判断post表单提交的数据 username password nickname 是否为空 为空则返回错误 
        if (body.username.trim().length <= 0 || body.password.trim().length <= 0 || body.nickname.trim().length <= 0) {
            return res.send({
                msg: '内容不能为空',
                status: 500
            })
        }
        // 如果数据不为空 那么要验证用户名是否存在
        const sql = 'select count(*) as count from blog_users where username=?'
        // 查询数据库 如果用户名已经存在则返回报错 
        conn.query(sql, body.username, (err, result) => {
            if (err) return res.send({
                msg: '未知错误',
                status: 501
            })
            if (result[0].count != 0) { // 根据查询的返回值判断用户名是否存在
                return res.send({
                    msg: '用户名已存在',
                    status: 501
                })
            }
            // 后续的操作都要写在 第一次查询的回调函数中 
            // 为什么？？因为后面的逻辑判断的条件 需要 查询的结果
            // 如果不存在 继续进行下一步 拼接ctime属性 利用moment().format('YYYY-MM-DD HH:mm:ss')
            body.ctime = moment().format('YYYY-MM-DD HH:mm:ss')

            // 加密password
            bcrypt.hash(body.password, saltRounds, (err, pwdCryped) => {
                body.password = pwdCryped
                // 把数据插入到数据库 如果err 则报错 否则 返回成功
                conn.query('insert into blog_users set ?', body, (err2, result2) => {
                    if (err) return res.send({
                        msg: '未知错误',
                        status: 501
                    })
                    res.send({
                        message: 'success',
                        data: null,
                        status: 200
                    })
                })
            })

        })
    },


    login: (req, res) => {
        // 获取post表单数据
        const body = req.body
        // 查询数据库 验证用户名 密码是否错误
        conn.query('select * from blog_users where username=?', body.username, (err, result) => {
            if (err) return res.send({
                status: 501,
                msg: '服务器未知错误'
            })

            if (result.length !== 1) return res.send({
                msg: '用户登录失败',
                status: 502
            })

            // 获取数据库查到的结果 对比 用户输入的密码与数据库的密码是否相同

            // 对比 密码的方法
            bcrypt.compare(body.password, result[0].password, function (err, comres) {
                if (!comres) {
                    return res.send({
                        status: 501,
                        msg: '密码错误'
                    })
                }
                // 如果成功 让服务器记录用户的登录状态
                req.session.user = result[0]
                req.session.isLogin = true
                res.send({
                    msg: 'success',
                    status: 200,
                    data: null
                })
            })

        })

    },
    logout: (req, res) => {
        req.session.destroy(function (err) {
            if (err) throw err;
            console.log('成功退出')
            // 实现服务器端的跳转，这个对比于 客户端跳转
            res.redirect('/');
        });
    }
}