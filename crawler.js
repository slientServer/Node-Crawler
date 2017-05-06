var url= require('url');
var config = require('config-lite')({
	config_basedir: __dirname
});
var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: true, waitTimeout: 20000, typeInterval: 2});
var jiraParse= require('./domParse/'+ config.domParseFunction);
var dashModel= require('./model/dashboard');
var userModel= require('./model/user');
var EventProxy= require('./event/eventproxy');
var eventproxy= EventProxy.getEventProxy();
var logger= require('./logger/winston')();
var compare= require('./compare');
var cheerio= require('cheerio');
var currentEmployeeId= '';
var latestScanCount= 0;
var allUsers= [];
var currenUserInfo= {};
module.exports= function(){
	function initDataPrepare(){
		compare.initLatestEvent();
		eventproxy.on('latestScanCount', function(res){
			latestScanCount= res.latestScanCount;
		});
		eventproxy.on('allUsersReady', function(res){
			allUsers= res;
			if(config.isLogin){
				cycleLoginForAllUsers();
			}else{view
				gotoMainPage();
			}
		});
		dashModel.getLatesScanCount();
		userModel.getAllUsers();
	}

	initDataPrepare();

	function cycleLoginForAllUsers(){
		var initIndex=0;
		eventproxy.on('onceUserScanFinished', function(){
			if(++initIndex< allUsers.length){
				currenUserInfo= allUsers[initIndex];
				login(allUsers[initIndex]);
			}else{
				logger.log('info', '%s round scan finished ......', (latestScanCount+1));
				eventproxy.removeListener('onceUserScanFinished');
				nightmare.end();
			}
		});			
	
		logger.log('info', 'First user login!');
		currenUserInfo= allUsers[initIndex];
		login(allUsers[initIndex]);
	}

	function login(userInfo){
		nightmare
		.goto(config.loginInfo.logoutUrl)
		.goto(config.loginInfo.loginUrl)
		.type('#login-form-username', userInfo.employeeId)
		.type('#login-form-password', userInfo.password)
		.click('#login-form-submit')
		.wait('#log_out')
		.then(function(result){
			logger.log('info', '%s login successfully!', userInfo.employeeId);
			currentEmployeeId= userInfo.employeeId;
			gotoMainPage();
		})
	  .catch(function (error) {
		  logger.log('error', '%s login failed!', userInfo.employeeId);
		  eventproxy.emit('onceUserScanFinished', currenUserInfo);
		});
	}

	function gotoMainPage(){
 		nightmare
 		.goto(config.entranceUrl)
 		.evaluate(function(){
 			var scriptText= document.querySelector('#content script').innerText;
			var dashboards= eval((new RegExp('AG[^]DashboardManager[^]setup\\({[^]*}\\);', 'm').exec(scriptText))[0].replace('AG.DashboardManager.setup', '')).layouts;
			var dashboardList= [];
			dashboards.forEach(function(value, key){
				dashboardList.push({
					id: value.id,
					title: value.title,
					url: 'https://jira.successfactors.com/secure/Dashboard.jspa?selectPageId='+ value.id
				});
			});
 			return dashboardList;
 		})
 		.then(function(result){
 			scanAllDashboards(result);
 		})
 		.catch(function(error){
 			logger.log('error', 'Open main page failed with: %s', error);
 		});
	}

	function scanAllDashboards(dashboardInfoList){
		var initIndex= 0;
		eventproxy.on('dashboradHandleFinished', function(){
			if(++initIndex< dashboardInfoList.length){
				gotoDashboardPage(dashboardInfoList[initIndex]);
			}else{
				eventproxy.removeListener('dashboradHandleFinished');
				eventproxy.emit('onceUserScanFinished', currenUserInfo);
			}
		});	
		gotoDashboardPage(dashboardInfoList[initIndex]);
	}

	function gotoDashboardPage(dashboardInfo){
		var selectors= jiraParse.generateDashboardSelector();	
		nightmare
		.goto(dashboardInfo.url)
		.wait(2000)
		.evaluate(function(selectors, dashboardInfo, currentEmployeeId, latestScanCount){
			var gadgetList=[];
			var gadget= {};
			var elem= '';
			var selectorElements= '';
			var gadgetListElement= document.querySelectorAll(selectors[0].selector[0]);
			for(var idy=0; idy< gadgetListElement.length; idy++){
				for(var idx=1; idx< selectors.length; idx++){
					selectorElements= selectors[idx].selector;
					for(var key in selectorElements){
						if(selectors[idx].key== 'totals' && document.querySelector('#'+gadgetListElement[idy].id+' '+selectorElements[key]) && document.querySelector('#'+gadgetListElement[idy].id+' '+selectorElements[key]).tagName== 'IFRAME'){
							elem= document.querySelector('#'+gadgetListElement[idy].id+' '+selectorElements[key]).contentWindow.document.querySelector('.gadget .view div p');
							break;
						}else if(document.querySelector('#'+gadgetListElement[idy].id+' '+selectorElements[key]) && document.querySelector('#'+gadgetListElement[idy].id+' '+selectorElements[key])[selectors[idx].content]){
							elem= document.querySelector('#'+gadgetListElement[idy].id+' '+selectorElements[key]);
							break;
						}
					}
					gadget[selectors[idx].key]= elem? elem[selectors[idx].content]: 0;
					gadget['dashboardId']= dashboardInfo.id;
					gadget['dashboardName']= dashboardInfo.title;
					gadget['gadgetId']= (/-\d*-/g.exec(gadgetListElement[idy].id))[0].replace(/-/g, '');
					gadget['employeeId']= currentEmployeeId;
					gadget['scanCount']= latestScanCount+1;
					elem= '';
				}
				gadgetList.push(gadget);
				gadget= {};
			};
			return gadgetList;
		}, selectors, dashboardInfo, currentEmployeeId, latestScanCount)
		.then(function(result){
			jiraParse.saveResultToDB(result);
			compare.maintainCurrentUserDashboard(result);
			eventproxy.emit('dashboradHandleFinished');
		})
		.catch(function(error){
			logger.log('warning', 'Dashboard %s open failed: %s', dashboardInfo.id, error);
		});
	}
}