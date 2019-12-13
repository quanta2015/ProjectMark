var express = require('express');

var bodyParser = require('body-parser');
var cors = require('cors');
var fs = require('fs');
var path = require('path');
var axios = require('axios');
var moment = require('moment')


var db = require("./db/db")


const app = express();

app.use(cors());
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(express.static(__dirname + '/'));

const port = 8080


function callProc(sql, params, res, cb) {
  db.procedureSQL(sql,JSON.stringify(params),(err,ret)=>{
    if (err) {
      res.status(500).json({ code: -1, msg: '提交请求失败，请联系管理员！', data: null})
    }else{
      cb(ret)
    }
  })
}


app.post('/login', async function (req, res) {
  let sql = `CALL PROC_USER_LOGIN(?)`
  let params = req.body

  callProc(sql, params, res, (users) => {
    if (users.length > 0) {
      res.status(200).json({code: 200, data: users[0], msg: '登录成功'})
    } else {
      res.status(200).json({code: 301, data: null, msg: '用户名或密码错误'})
    }
  })
})


app.post('/projList', async function (req, res) {
  let sql = `CALL PROC_PROJ_LIST(?)`
  let params = req.body

  callProc(sql, params, res, (projects) => {
    if (projects.length > 0) {
      res.status(200).json({code: 200, data: projects, msg: '项目列表成功'})
    } else {
      res.status(200).json({code: 301, data: null, msg: '项目列表失败'})
    }
  })
})

app.post('/mark', async function (req, res) {
  let sql = `CALL PROC_MARK(?)`
  let params = req.body

  callProc(sql, params, res, (data) => {
    if (data.length > 0) {
      res.status(200).json({code: 200, data: data, msg: '取评分成功'})
    } else {
      res.status(200).json({code: 301, data: null, msg: '取评分失败'})
    }
  })
})

app.post('/markProj', async function (req, res) {
  let sql1 = `CALL PROC_MARK_PROJ(?)`
  let sql2 = `CALL PROC_PROJ_LIST(?)`
  let params = req.body

  db.procedureSQL(sql1, JSON.stringify(params), (err, r1) => {
    if (err) {
      res.status(500).json({code:-1, msg:'评分失败，请联系管理员!'})
    } else {
      db.procedureSQL(sql2, JSON.stringify(params), (err, r2) => {
        if (err) {
          res.status(500).json({code:-1, msg:'评分失败，请联系管理员!'})
        } else {
          res.status(200).json({code: 200, data: {user: r1, proj: r2}, msg: '评分成功'})
        }
      })
    }
  })

})

app.listen(port, () => console.log(`> Running on localhost:${port}`));
