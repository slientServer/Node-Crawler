var url= require('url');
var superagent= require('superagent');
var async= require('async');
try {
    var Spooky = require('spooky');
} catch (e) {
    var Spooky = require('../lib/spooky');
}
var spooky = new Spooky({
        child: {
            transport: 'http'
        },
        casper: {
            logLevel: 'debug',
            verbose: true
        }
 });

var ep= require('eventproxy')();
var config = require('config-lite')({
	config_basedir: __dirname
});
var domParse= require('./domParse/'+ config.domParseFunction);

module.exports= function(req, res){
	var renderRes= res;
	var entranceUrl= prepareUrls();
	if(config.isLogin){
		login();
	}else{
		requestEntancePage('');
	}

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
					'set-cookie': []
				}
			}
		}  
		superagent.get(config.entranceUrl).set('Cookie', cookieParse(oRes.headers['set-cookie'])).end(function(err, oRes){
			parseDom(oRes.text);
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

	function parseDom(dom){
		domParse(renderRes, dom);
	}
}