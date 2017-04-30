var User = require('../lib/mongo').User;
var EventProxy= require('../event/eventproxy');
var eventproxy= EventProxy.getEventProxy();
var logger= require('../logger/winston')();

module.exports= {
 // 注册一个用户
 create: function create(user) {
    return User.create(user, function (err, user) {
	  	if (err) return handleError(err);
	  	return true;
	});
  },

  findOneAndUpdate: function findOneAndUpdate(key, value, newVlaue){
  	var query= {};
  	var newVal= {};
  	query[key]= value;
  	newVal[key]= newVlaue;
  	User.findOneAndUpdate(query, newVal, function(err, doc){
  		if(err) logger.log('error', err);
  		return true;
  	});
  },

  getAllUsers: function getAllUsers(){
  	return User.find(function(err, res){
		  if (err) logger.log('error', err);
      eventproxy.emit('allUsersReady', res);
  	});
  }
}