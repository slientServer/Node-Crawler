var express= require('express');
var router= express.Router();
var userModel= require('./model/user');

module.exports= function(app){
	app.get('/login', function(req, res){
		res.render('login');
	});

	app.get('/signup', function(req, res){
		res.render('signup');
	});

	app.post('/signup', function(req, res){
	  console.log(req.fields);

	  // var username = req.fields.username;
	  // var password = req.fields.password;
	  // var repassword = req.fields.repassword;

	  //  // 校验参数
	  // try {
	  //   if (password !== repassword) {
	  //     throw new Error('两次输入密码不一致');
	  //   }
	  // } catch (e) {
	  //   // 注册失败，异步删除上传的头像
	  //   req.flash('error', e.message);
	  //   return res.redirect('/signup');
	  // }

	  // // 待写入数据库的用户信息
	  // var user = {
	  //   nickname: name,
	  //   nickpassword: password
	  // };

	  // userModel.create(user);
	  // res.redirect('/index');
	});
}