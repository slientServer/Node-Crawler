var Dashboard = require('../lib/mongo').Dashboard;
var EventProxy= require('../event/eventproxy');
var eventproxy= EventProxy.getEventProxy();
var logger= require('../logger/winston')();

module.exports= {

 create: function create(dashboard) {
    return Dashboard.create(dashboard, function (err, dashboard) {
	  	if (err) logger.log('error', 'Dashboard %s save faile with: %s', dashboard.gadgetId, err);
	  	logger.log('info', 'One dashboard save successfully!');
	});
  },

  getAllDashboards: function getAllDashboards(){
  	return Dashboard.find(function(err, res){
		  if (err) return handleError(err);
      console.log(res);
  	});
  },

  getCurrentScanCount: function getCurrentScanCount(){
    Dashboard
      .find()
      .select('scanCount')
      .sort('-scanCount')
      .limit(1)
      .exec(function(err, res){
        var scanCount=0;
        if(res[0] && res[0].scanCount){
          scanCount= res[0].scanCount;
        }
        eventproxy.emit('latestScanCount', {'latestScanCount': scanCount});
      });
  },
}