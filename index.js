var app= require('express')();
var config = require('config-lite')({
	config_basedir: __dirname
});
var crawler= require('./crawler');
var routes= require('./routes');
var logger= require('./logger/winston')();
var email= require('./email/email');

email('biao.hao@sap.com');

routes(app);

app.listen(config.port, function(){
	logger.log('info', 'Server start successfully !')
	// crawler(false);
});