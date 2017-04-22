var url= require('url');
var superagent= require('superagent');
var cheerio= require('cheerio');
var async= require('async');
var ep= require('eventproxy')();
var config = require('config-lite')({
	config_basedir: __dirname
});

module.exports= function(req, res){
	var renderRes= res;
	var entranceUrl= prepareUrls();
	if(config.isLogin){
		login();
	}else{
		requestEntancePage();
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
		return config.pageUrls;
	}

	function login(){
		var loginInfo= {};
		var header= {
			"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",
		};
		loginInfo[config.loginInfo.usernameKey]= config.loginInfo.username;
		loginInfo[config.loginInfo.passwordKey]= config.loginInfo.password;
		superagent.post(config.loginInfo.loginUrl).send(loginInfo).set(header).end(function(err, oRes){
			requestEntancePage(oRes);
		});
	}

	function requestEntancePage(oRes){
		if(!oRes){
			oRes={
				headers: {
					'set-cookie': ''
				}
			}
		}
		superagent.get(config.entranceUrl).set('Cookie', cookieParse(oRes.headers['set-cookie'])).end(function(err, oRes){
			renderRes.send(oRes.text);
		});
	}

	function cookieParse(orginArr){
		var cookieNameList= config.loginInfo.cookieKeys;
		var result= '';
		orginArr.forEach(function(value){
			for(var idx=0; idx< cookieNameList.length; idx++){
				if((res= (new RegExp('^'+cookieNameList[idx]+'='+'\\S*;', 'i').exec(value)))){
					result= result+ res[0];
				}
			}
		})
		return result;
	}
}