var app= require('express')();
var config = require('config-lite')({
	config_basedir: __dirname
});
var crawler= require('./crawler');
var express = require('express');
var routes= require('./routes');
var logger= require('./logger/winston')();
var later= require('later');
var session= require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

//设置模板目录
app.set('views', __dirname+'/view');
//设置模板引擎
app.set('view engine', 'ejs');

//设置静态目录
app.use(express.static(__dirname+'/public'));

//session 中间件
app.use(session({
  name: config.session.key, //设置cookie中sessionId字段名称
  secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true,// 强制更新 session
  saveUninitialized: false,// 设置为 false，强制创建一个 session，即使用户未登录
  cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: new MongoStore({// 将 session 存储到 mongodb
    url: config.mongodb// mongodb 地址
  })
}));

// flash 中间件，用来显示通知
app.use(flash());

// 添加模板必需的三个变量
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});

routes(app);

var sched= later.parse.recur().on(config.jobRunTime).time();
later.date.localTime();
later.setInterval(function(){
	logger.log('info', 'Scan start ...');
	crawler(false);
}, sched);

app.listen(config.port, function(){
	logger.log('info', 'Server start successfully!')
	// crawler(false);
});