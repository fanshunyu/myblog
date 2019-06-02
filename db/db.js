const mysql = require('mysql')

const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'mysql_001',
    multipleStatements:true
})

module.exports = conn

//运用到了分层开发的一个思想 
// MVC 
// M --- model 数据
// V --- View 视图
// C --- Controller 控制器

// 目的就是为了在后期学习前端框架中的一个思想 MVVM