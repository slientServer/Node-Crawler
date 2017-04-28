var url= require('url');
var config = require('config-lite')({
	config_basedir: __dirname
});
var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: true });
var jiraParse= require('./domParse/'+ config.domParseFunction);
var dashModel= require('./model/dashboard');
var EventProxy= require('./event/eventproxy');
var eventproxy= EventProxy.getEventProxy();
var currentEmployeeId= '';
var latestScanCount= 0;
module.exports= function(req, res){
	eventproxy.on('latestScanCount', function(res){
		latestScanCount= res.latestScanCount;
	});
	dashModel.getCurrentScanCount();

	if(config.isLogin){
		login();
	}else{
		gotoMainPage();
	}

	function login(){
		nightmare
		.goto(config.loginInfo.loginUrl)
		.type('#login-form-username', config.loginInfo.username)
		.type('#login-form-password', config.loginInfo.password)
		.click('#login-form-submit')
		.wait('#log_out')
		.then(function(result){
			currentEmployeeId= config.loginInfo.username;
			gotoMainPage();
		})
	    .catch(function (error) {
		    console.error('Search failed:', error);
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
 		});
	}

	function scanAllDashboards(dashboardInfoList){
		var initIndex= 0;
		gotoDashboardPage(dashboardInfoList[initIndex]);
		eventproxy.on('dashboradHandleFinished', function(){
			if(++initIndex< dashboardInfoList.length){
				gotoDashboardPage(dashboardInfoList[initIndex]);
			}else{
				eventproxy.removeListener('dashboradHandleFinished');
			}
		});	
	}

	function gotoDashboardPage(dashboardInfo){
		var selectors= jiraParse.generateDashboardSelector();	
		nightmare
		.goto(dashboardInfo.url)
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
						if(document.querySelector('#'+gadgetListElement[idy].id+' '+selectorElements[key])){
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
		}, selectors, dashboardInfo, currentEmployeeId,latestScanCount)
		.then(function(result){
			jiraParse.saveResultToDB(result);
			eventproxy.emit('dashboradHandleFinished');
		});
	}
}