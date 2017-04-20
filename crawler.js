var url= require('url');
var superagent= require('superagent');
var cheerio= require('cheerio');
var async= require('async');
var ep= require('eventproxy')();
var config = require('config-lite')({
	config_basedir: __dirname
});

module.exports= function(req, res){
	var pageUrls= prepareUrls();
	if(config.isLogin){
		login();
	}

	// pageUrls.forEach(function(pageUrl){

	// 	superagent.get(pageUrl).end(function(err,res){
	// 	  // pres.text 里面存储着请求返回的 html 内容，将它传给 cheerio.load 之后
	// 	  // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
	// 	  // 剩下就都是利用$ 使用 jquery 的语法了
	// 		// responsObj.send(res.text);
	// 	  // var $ = cheerio.load(res.text);
	// 	  // var curPageUrls = $('.titlelnk');
	// 	  // for(var i = 0 ; i < curPageUrls.length ; i++){
	// 	  // 	var articleUrl = curPageUrls.eq(i).attr('href');
	// 	  // 	urlsArray.push(articleUrl);
	// 	  // 	// 相当于一个计数器
	// 	  // 	ep.emit('BlogArticleHtml', articleUrl);
	// 	  // }
	// 	});
	// });
	// ep.after('BlogArticleHtml', pageUrls.length*20 ,function(articleUrls){
	// // 当所有 'BlogArticleHtml' 事件完成后的回调触发下面事件
	// // ...

	// });

	function prepareUrls(){
		return ['https://jira.successfactors.com/secure/Dashboard.jspa'];
	}

	function login(){
		superagent.post('https://www.baidu.com').send({os_username: config.username, os_password: config.password, login: "Log In"}).set('Accept', 'application/json').end(function(err, ores){
			res.send(ores.headers['set-cookie']);
			// superagent.get('https://jira.successfactors.com').set('Cookie', ).end(function(){

			// });
		});
	}



}