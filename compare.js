var dashModel= require('./model/dashboard');
var userModel= require('./model/user');
var EventProxy= require('./event/eventproxy');
var eventproxy= EventProxy.getEventProxy();
var logger= require('./logger/winston')();
var email= require('./email/email');
var formattedData= {};
var currentUserDashboardList=[];
var needToNotification=[];

module.exports= {
	initLatestEvent: function initLatestEvent(){
		eventproxy.on('lastRoundRecord', function(res){
				res.forEach(function(value){
					formattedData[value.employeeId+value.dashboardId+value.gadgetId]= value.totals;
				});
		});
		eventproxy.on('onceUserScanFinished', function(data){

			if(currentUserDashboardList.length> 0){
				compareRecord(data, currentUserDashboardList);
				currentUserDashboardList=[];
			}
		});

		function compareRecord(currentUserInfo, dashboardListForUser){
			var tempInfo={};
			for(var idx=0; idx< dashboardListForUser.length; idx++){
				tempInfo= dashboardListForUser[idx];
				if(tempInfo.totals!= formattedData[tempInfo.employeeId+tempInfo.dashboardId+tempInfo.gadgetId]){
					needToNotification.push({
						'dashboardName': tempInfo.dashboardName,
						'dashboardId': tempInfo.dashboardId,
						'gadgetName': tempInfo.gadgetName,
						'newTotals': tempInfo.totals,
						'oldTotals': (formattedData[tempInfo.employeeId+tempInfo.dashboardId+tempInfo.gadgetId]== undefined? 'NA': formattedData[tempInfo.employeeId+tempInfo.dashboardId+tempInfo.gadgetId]),
						'filter': tempInfo.gadgetFilter || 'none'
					});
				}
			}
		
			if(needToNotification.length> 0){
				sendEmailToEmployee(currentUserInfo, needToNotification);
			}
			needToNotification= [];
		}

		function sendEmailToEmployee(currentUserInfo, needToNotification){
			var template= '<p style= "margin: 10px 0 10px 0;">The gadget <span style="color: red;">[gadgetname]</span>(filter by [filter]) totals under dashboard <span style="color: red;"><a href="https://jira.successfactors.com/secure/Dashboard.jspa?selectPageId=[dashboardId]">[dashboardname]</a></span> change from <span style="color: green;">[oldtotals]</span> to <span style="color: green;">[newtotals]</span>.'
			var mainContent= '';
			for(var idx=0; idx< needToNotification.length; idx++){
				mainContent= mainContent+ (template.replace('[gadgetname]', needToNotification[idx].gadgetName).replace('[dashboardname]', needToNotification[idx].dashboardName).replace('[oldtotals]', needToNotification[idx].oldTotals).replace('[newtotals]', needToNotification[idx].newTotals).replace('[filter]', needToNotification[idx].filter)).replace('[dashboardId]', needToNotification[idx].dashboardId);
			}

			if(currentUserInfo.isNotifyEmail== 'y'){
				// email(currentUserInfo.email, currentUserInfo.nickname, mainContent);
			}
			if(currentUserInfo.isNotifyWechat== 'y'){

			}
		}
	},

	maintainCurrentUserDashboard: function(dashboardInfo){
		currentUserDashboardList= currentUserDashboardList.concat(dashboardInfo);
	}
}
