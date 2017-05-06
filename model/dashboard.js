var Dashboard = require('../lib/mongo').Dashboard;
var EventProxy= require('../event/eventproxy');
var eventproxy= EventProxy.getEventProxy();
var logger= require('../logger/winston')();

module.exports= {

 create: function create(dashboard) {
    return Dashboard.create(dashboard, function (err, dashboard) {
	  	if (err) {
        logger.log('error', 'Dashboard save faile with: %s', dashboard);
      }else{
        logger.log('info', 'One dashboard save successfully!');
      }
	 });
  },

  getAllDashboards: function getAllDashboards(){
  	return Dashboard.find(function(err, res){
		  if (err) return handleError(err);
      console.log(res);
  	});
  },

  getLatesScanCount: function getLatesScanCount(){
    var x=123;
    Dashboard
      .find()
      .select('scanCount')
      .sort('-scanCount')
      .limit(1)
      .exec(function(err, res){
        if(err) logger.log('error', 'Latest round count fetch failed');
        var scanCount=0;
        if(res[0] && res[0].scanCount){
          scanCount= res[0].scanCount;
        }
        eventproxy.emit('latestScanCount', {'latestScanCount': scanCount});
        Dashboard.find({'scanCount': scanCount}, {},  function(err, res){
          if(err) logger.log('error', 'Latest record %s fetch failed', scanCount);
          eventproxy.emit('lastRoundRecord', res);
        });
      });
  }
}