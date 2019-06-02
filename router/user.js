const express = require('express')

const router = express.Router()

const ctrl = require('../controller/user')
// 访问注册页面
router.get('/register',ctrl.showRegisterPage)
// 登录
router.get('/login',ctrl.showLoginPage)
// 用户退出登录/注销
router.get('/logout',ctrl.logout)
// 新增用户
router.post('/register',ctrl.register)

// 用户登录
router.post('/login',ctrl.login)

module.exports = router